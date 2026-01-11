import { Request, Response } from 'express';
import order_model from '../models/order.model';
import serve_session_model from '../models/serve-session.model';

const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await order_model.findById(id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  return res.status(200).json(order);
};

const createOrder = async (req: Request, res: Response) => {
  const { serve_session_id, table_order_id, ordered } = req.body;

  const newOrder = new order_model({
    serve_session_id,
    table_order_id,
    ordered,
    time_ordered: new Date(),
  });

  try {
    await newOrder.save();
    return res.status(201).json(newOrder);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating order', error });
  }
};

const canceledFood = async (req: Request, res: Response) => {
  const { items } = req.body;

  try {
    const processed: any[] = [];

    for (const item of items) {
      const { order_id, cancelItems } = item;

      const order = await order_model.findById(order_id);
      if (!order) {
        return res.status(404).json({ message: `Order with id ${order_id} not found` });
      }

      const { ordered, table_order_id } = order;

      const cancelled: Array<Record<string, unknown>> = [];
      const preparing: Array<Record<string, unknown>> = [];

      for (const ordItem of ordered) {
        const cancelItem = cancelItems.find((ci: any) => ci.food_id === ordItem.food_id.toString());

        if (cancelItem) {
          const qtyToCancel = Number(cancelItem.quantity) || 0;
          const remainingQty = (Number(ordItem.quantity) || 0) - qtyToCancel;

          cancelled.push({
            food_id: ordItem.food_id,
            quantity: qtyToCancel,
            price: ordItem.price,
            table_id: table_order_id,
            time_cancelled: new Date(),
          });

          // only add preparing entry when there's still remaining quantity
          if (remainingQty > 0) {
            preparing.push({
              food_id: ordItem.food_id,
              quantity: remainingQty,
              price: ordItem.price,
              table_id: table_order_id,
              time_started: new Date(),
            });
          }
        } else {
          preparing.push({
            food_id: ordItem.food_id,
            quantity: ordItem.quantity,
            price: ordItem.price,
            table_id: table_order_id,
            time_started: new Date(),
          });
        }
      }

      // Use Mongoose document setters to safely replace subdocument arrays
      // (avoids TypeScript typings issues — DocumentArray vs raw array)
      order.set('ordered', []);
      order.set('cancelled', cancelled);
      order.set('preparing', preparing);

      await order.save();

      processed.push(order);
    }

    // processed contains updated order documents for each item entry processed
    return res.status(200).json({ processed });
  } catch (error) {
    return res.status(500).json({ message: 'Error canceling food', error });
  }
};

const serveFood = async (req: Request, res: Response) => {
  const { items } = req.body;

  try {
    const processed: any[] = [];

    for (const item of items) {
      const { order_id, serveItems } = item;

      const order = await order_model.findById(order_id);
      if (!order) {
        return res.status(404).json({ message: `Order with id ${order_id} not found` });
      }

      const { preparing, served = [], serve_session_id } = order;

      const addServed = [];
      for (const serve of serveItems) {
        const pre = preparing.find((i) => i.food_id.toString() === serve.food_id);
        const serveQty = Number(serve.quantity);

        if (pre) {
          const preQty = Number(pre.quantity);
          const remainingQty = (Number(preQty) || 0) - serveQty;

          pre.quantity = remainingQty > 0 ? remainingQty : 0;

          addServed.push({
            food_id: pre.food_id,
            quantity: serveQty,
            price: pre.price,
            table_id: pre.table_id,
            time_served: Date.now(),
          });
        }
      }
      const newPreparing = preparing.filter((i) => i.quantity > 0);

      // Use Mongoose document setters to safely replace subdocument arrays
      // (avoids TypeScript typings issues — DocumentArray vs raw array)
      order.set('preparing', newPreparing);
      order.set('served', [...served, ...addServed]);

      await order.save();

      if (addServed.length) {
        const serve_ss = await serve_session_model.findById(serve_session_id);

        if (serve_ss) {
          serve_ss.set('is_updated_served', false);

          await serve_ss.save();
        }
      }

      processed.push({ order, newPreparing, addServed });
    }

    // processed contains updated order documents for each item entry processed
    return res.status(200).json({ processed });
  } catch (error) {
    return res.status(500).json({ message: 'Error canceling food', error });
  }
};

const getOrderForKitchen = async (req: Request, res: Response) => {
  try {
    const serve_sessions = await serve_session_model.find({ ended_at: null });

    const allOrders = [];

    for (const ss of serve_sessions) {
      const id = ss._id;

      const orders = await order_model
        .find({
          serve_session_id: id,
          preparing: { $exists: true, $ne: [] },
        })
        .populate('preparing.food_id preparing.table_id');
      allOrders.push(...orders);
    }

    return res.status(200).json({ allOrders });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching orders for kitchen', error });
  }
};

export const order_controller = {
  createOrder,
  getOrderById,
  canceledFood,
  serveFood,
  getOrderForKitchen,
};
