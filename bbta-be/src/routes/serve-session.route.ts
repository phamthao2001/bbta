import { Router } from 'express';
import { serve_session_controller } from '../controllers/serve-session.controller';

const route = Router();

route.post('/serve-session/create', serve_session_controller.createServeSession);

export const serve_session_route = route;
