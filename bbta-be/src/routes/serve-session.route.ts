import { Router } from 'express';
import { serve_session_controller } from '../controllers/serve-session.controller';

const route = Router();

route.post('/serve-session/create', serve_session_controller.createServeSession);

route.get('/serve-session/:id', serve_session_controller.getServeSessionById);

route.post('/serve-session/switch-table', serve_session_controller.switchTable);

route.post('/serve-session/gen-bill', serve_session_controller.genBill);

export const serve_session_route = route;
