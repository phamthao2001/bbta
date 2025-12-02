import { NextFunction, Request, Response } from 'express';
import staff_model from '../models/staff.model';

const isStaff = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const staff = await staff_model.findOne({ phone: token });
  if (!staff) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  (req as any).staff = staff;
  next();
};

export const isStaff_middleware = isStaff;
