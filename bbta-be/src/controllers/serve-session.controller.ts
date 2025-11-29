import { Request, Response } from 'express';
import order_model from '../models/order.model';
import serve_session_model from '../models/serve-session.model';

const generateCodeLogin = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const length = 64;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const createServeSession = async (req: Request, res: Response) => {
  const { table_ids } = req.body;

  const code_login = generateCodeLogin();

  const newServeSession = new serve_session_model({
    table_ids,
    code_login,
  });

  try {
    await newServeSession.save();

    return res.status(201).json(newServeSession);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating serve session', error });
  }
};

const getServeSessionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const serve_session = await serve_session_model.findById(id).populate('table_ids');
    const order_serve_session = await order_model
      .find({ serve_session_id: id })
      .populate(
        'table_order_id ordered.food_id preparing.food_id cancelled.food_id served.food_id preparing.table_id cancelled.table_id served.table_id',
      );

    if (!serve_session) {
      return res.status(404).json({ message: 'Serve session not found' });
    }

    return res.status(200).json({ serve_session, order_serve_session });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving serve session', error });
  }
};

const switchTable = async (req: Request, res: Response) => {
  const { serve_session_id, table_id, target_table_id } = req.body;

  try {
    const ss = await serve_session_model.findById(serve_session_id);

    if (!ss) {
      return res.status(404).json({ message: 'Serve session not found' });
    }

    const { table_ids } = ss;

    if (!table_ids.includes(table_id)) {
      return res.status(404).json({ message: 'table_id not includes in serve session' });
    }

    const indexTableId = table_ids.indexOf(table_id);
    table_ids[indexTableId] = target_table_id;

    ss.set('table_ids', table_ids);
    await ss.save();

    const orders = await order_model.find({
      serve_session_id: serve_session_id,
      table_order_id: table_id,
    });

    for (const order of orders) {
      const { preparing } = order;

      const newPreparing = preparing.map((i) => ({
        ...i,
        table_id: target_table_id,
      }));

      order.set('table_order_id', target_table_id);
      order.set('preparing', newPreparing);

      await order.save();
    }

    return res.status(200).json({ ss, table_ids, indexTableId, orders });
  } catch (e) {
    return res.status(500).json({ message: 'Error retrieving serve session', e });
  }
};

export const serve_session_controller = {
  createServeSession,
  getServeSessionById,
  switchTable,
};
