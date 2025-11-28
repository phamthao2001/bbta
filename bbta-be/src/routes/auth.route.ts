import { Router } from 'express';
import { auth_controller } from '../controllers/auth.controller';

const route = Router();

route.post('/auth/code-login', auth_controller.codeLoginSession);

export const auth_route = route;
