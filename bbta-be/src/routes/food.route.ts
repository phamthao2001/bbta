import { Router } from 'express';
import { food_controller } from '../controllers/food.controller';

const route = Router();

route.get('/food', food_controller.getAll);

route.post('/food', food_controller.addFood);

export const food_route = route;
