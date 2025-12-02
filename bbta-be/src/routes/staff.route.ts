import { Router } from 'express';
import { staff_controller } from '../controllers/staff.controller';

const route = Router();

route.get('/staff', staff_controller.getAll);

route.post('/staff/login', staff_controller.login);

route.post('/staff', staff_controller.addStaff);

route.put('/staff/:id', staff_controller.updateStaff);

route.delete('/staff/:id', staff_controller.deleteStaff);

export const staff_route = route;
