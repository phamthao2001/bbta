import { compare, hash } from 'bcrypt';
import { Request, Response } from 'express';
import staff_model from '../models/staff.model';
import { genToken_utils } from '../utils/gen-token';

const getAll = async (req: Request, res: Response) => {
  try {
    const staff = await staff_model.find({ is_deleted: false });
    return res.status(200).json(staff);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching staff', error });
  }
};

const addStaff = async (req: Request, res: Response) => {
  const { username, name, email, phone, salary, password } = req.body;
  try {
    const newStaff = new staff_model({
      username,
      name,
      email,
      phone,
      salary: Number(salary),
      password: await hash(password, 12),
    });

    const savedStaff = await newStaff.save();
    return res.status(201).json(savedStaff);
  } catch (error) {
    return res.status(500).json({ message: 'Error adding staff', error });
  }
};

const updateStaff = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, name, email, phone, salary } = req.body;

  try {
    const updatedStaff = await staff_model.findByIdAndUpdate(
      id,
      { username, name, email, phone, salary },
      { new: true },
    );
    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    return res.status(200).json({ message: 'Staff updated successfully', id: updatedStaff._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating staff', error });
  }
};

const deleteStaff = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedStaff = await staff_model.findByIdAndUpdate(id, { is_deleted: true });
    if (!deletedStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    return res.status(200).json({ message: 'Staff deleted successfully', id: deletedStaff._id });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting staff', error });
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const admin = await staff_model.findOne({ username, is_deleted: { $ne: true } });
  if (!admin) {
    return res.status(401).json({ message: 'Invalid username' });
  }

  // compare password
  const isPasswordValid = await compare(password, admin.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  return res
    .status(200)
    .json({ message: 'Login successful', token: genToken_utils.genToken(admin._id.toString()) });
};

export const staff_controller = { getAll, addStaff, updateStaff, deleteStaff, login };
