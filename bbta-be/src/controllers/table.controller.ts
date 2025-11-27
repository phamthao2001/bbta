import { Request, Response } from 'express';
import serve_session_model from '../models/serve-session.model';
import table_model from '../models/table.model';

const getAll = async (req: Request, res: Response) => {
  try {
    const tables = await table_model.find();

    const serve_session = await serve_session_model.find({
      ended_at: { $eq: null },
    });
    res.status(200).json({ tables, serve_session });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tables', error });
  }
};

const addTable = async (req: Request, res: Response) => {
  const { name, description, capacity } = req.body;

  const newTable = new table_model({
    name,
    description,
    capacity: Number(capacity),
  });

  try {
    const savedTable = await newTable.save();
    res.status(201).json(savedTable);
  } catch (error) {
    res.status(500).json({ message: 'Error adding table', error });
  }
};

export const table_controller = {
  getAll,
  addTable,
};
