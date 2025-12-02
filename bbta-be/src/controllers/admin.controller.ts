import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import admin_model from '../models/admin.model';
import table_model from '../models/table.model';
import { genToken_utils } from '../utils/gen-token';

const getAll = async (req: Request, res: Response) => {
  try {
    const admins = await admin_model.find({ is_deleted: false });
    return res.status(200).json(admins);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching admins', error });
  }
};

const addAdmin = async (req: Request, res: Response) => {
  const { username, name, email, phone, password } = req.body;
  try {
    const admin = new admin_model({
      username,
      name,
      email,
      phone,
      password: await bcrypt.hash(password, 12),
    });
    await admin.save();
    return res.status(200).json({ message: 'Admin added successfully', id: admin._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding admin', error });
  }
};

const deleteAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const table = await admin_model.findById(id);
  if (!table) {
    return res.status(404).json({ message: 'Admin not found' });
  }
  table.is_deleted = true;
  await table.save();
  return res.status(200).json({ message: 'Table deleted successfully', id: table._id });
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const admin = await admin_model.findOne({ username, is_deleted: { $ne: true } });
  if (!admin) {
    return res.status(401).json({ message: 'Invalid username' });
  }

  // compare password
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  return res
    .status(200)
    .json({ message: 'Login successful', token: genToken_utils.genToken(admin._id.toString()) });
};

const getTable = async (req: Request, res: Response) => {
  try {
    const tables = await table_model.find({ is_deleted: { $ne: true } });
    return res.status(200).json(tables);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching tables', error });
  }
};

const addTable = async (req: Request, res: Response) => {
  const { name, description, capacity } = req.body;
  try {
    const table = new table_model({ name, description, capacity: Number(capacity) });
    await table.save();
    return res.status(200).json({ message: 'Table added successfully', id: table._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding table', error });
  }
};

const deleteTable = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const table = await table_model.findById(id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    table.is_deleted = true;
    await table.save();
    return res.status(200).json({ message: 'Table deleted successfully', id: table._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding table', error });
  }
};

export const admin_controller = {
  getAll,
  login,
  getTable,
  deleteTable,
  addTable,
  addAdmin,
  deleteAdmin,
};
