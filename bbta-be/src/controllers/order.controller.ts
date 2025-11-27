import { Request, Response } from 'express';
import order_model from '../models/order.model';

const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = order_model.findById(id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  return res.status(200).json(order);
};

const createOrder = async (req: Request, res: Response) => {
  const {} = req.body;
};

export const order_controller = {
  createOrder,
  getOrderById,
};
