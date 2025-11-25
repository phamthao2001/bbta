import { Router } from 'express';
import { table_controller } from '../controllers/table.controller';

const route = Router();

route.get('/staff', table_controller.getAll);

route.post('/staff', table_controller.addTable);

export const staff_route = route;
