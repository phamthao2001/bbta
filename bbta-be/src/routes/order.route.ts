import { Router } from 'express';
import { order_controller } from '../controllers/order.controller';

const route = Router();

route.get('/order/:id', order_controller.getOrderById);

route.post('/order/create', order_controller.createOrder);

export const order_route = route;
