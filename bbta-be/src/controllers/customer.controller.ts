import { compare, hash } from 'bcrypt';
import { Request, Response } from 'express';
import customer_model from '../models/customer.model';
import { genToken_utils } from '../utils/gen-token';

const getAll = async (req: Request, res: Response) => {
  try {
    const staff = await customer_model.find({ is_deleted: false });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff', error });
  }
};

const addCustomer = async (req: Request, res: Response) => {
  const { name, sex, phone, password, birthday } = req.body;
  try {
    const existingCustomer = await customer_model.findOne({ phone });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer with this phone number already exists' });
    }
    const newCustomer = new customer_model({
      name,
      sex,
      phone,
      password: await hash(password, 12),
      birthday,
    });
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Error adding customer', error });
  }
};

const deleteCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedCustomer = await customer_model.findByIdAndUpdate(id, { is_deleted: true });
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: 'Customer deleted successfully', id: deletedCustomer._id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
};

const loginCustomer = async (req: Request, res: Response) => {
  const { phone, password } = req.body;
  try {
    const customer = await customer_model.findOne({ phone, is_deleted: false });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const isPasswordValid = await compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    res
      .status(200)
      .json({
        message: 'Login successful',
        customer,
        token: genToken_utils.genToken(customer._id.toString()),
      });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in customer', error });
  }
};

export const customer_controller = {
  getAll,
  addCustomer,
  deleteCustomer,
  loginCustomer,
};
