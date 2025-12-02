import { NextFunction, Request, Response } from 'express';
import admin_model from '../models/admin.model';

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const admin = await admin_model.findOne({ username: token });
  if (!admin) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  (req as any).admin = admin;
  next();
};

export const isAdmin_middleware = isAdmin;
