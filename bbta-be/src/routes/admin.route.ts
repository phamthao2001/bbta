import { Router } from 'express';
import { admin_controller } from '../controllers/admin.controller';

const route = Router();

route.get('/admin', admin_controller.getAll);
route.post('/admin', admin_controller.addAdmin);
route.delete('/admin/:id', admin_controller.deleteAdmin);

route.post('/admin/login', admin_controller.login);
route.get('/admin/get-table', admin_controller.getTable);
route.delete('/admin/delete-table/:id', admin_controller.deleteTable);

export const admin_route = route;
