import { Router } from 'express';
import { customer_controller } from '../controllers/customer.controller';

const route = Router();

route.get('/customer', customer_controller.getAll);

route.post('/customer', customer_controller.addCustomer);

route.delete('/customer/:id', customer_controller.deleteCustomer);

route.post('/customer/login', customer_controller.loginCustomer);

export const customer_route = route;
