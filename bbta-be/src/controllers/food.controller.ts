import { Request, Response } from 'express';
import food_model from '../models/food.model';

const getAll = async (req: Request, res: Response) => {
  try {
    const foods = await food_model.find();
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching foods', error });
  }
};

const addFood = async (req: Request, res: Response) => {
  const { name, description, price, image_url, category } = req.body;

  const newFood = new food_model({
    name,
    description,
    price: Number(price),
    image_url,
    category,
  });

  try {
    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (error) {
    res.status(500).json({ message: 'Error adding food', error });
  }
};

export const food_controller = {
  getAll,
  addFood,
};
