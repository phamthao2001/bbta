import { Router } from 'express';
import { table_controller } from '../controllers/table.controller';

const route = Router();

route.get('/table', table_controller.getAll);

route.post('/table', table_controller.addTable);

export const table_route = route;
