import { Router } from 'express';
import { serve_session_controller } from '../controllers/serve-session.controller';

const route = Router();

route.get('/serve-session/check/:id', serve_session_controller.checkServeSession);

route.post('/serve-session/create', serve_session_controller.createServeSession);

route.get('/serve-session/:id', serve_session_controller.getServeSessionById);

route.post('/serve-session/switch-table', serve_session_controller.switchTable);

route.post('/serve-session/gen-bill', serve_session_controller.genBill);

route.post('/serve-session/pay/:id', serve_session_controller.payServeSession);

route.post('/serve-session/end/:id', serve_session_controller.endServeSession);

route.get('/serve-session/dashboard/sumary', serve_session_controller.getSumaryServeSession);

export const serve_session_route = route;
