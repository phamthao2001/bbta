import { Router } from 'express';
import { order_controller } from '../controllers/order.controller';

const route = Router();

route.get('/order/:id', order_controller.getOrderById);

route.get('/orders/for-kitchen', order_controller.getOrderForKitchen);

route.post('/order/create', order_controller.createOrder);

route.post('/order/cancel-food', order_controller.canceledFood);

route.post('/order/serve-food', order_controller.serveFood);

export const order_route = route;
