import { Request, Response } from 'express';
import serve_session_model from '../models/serve-session.model';

const codeLoginSession = async (req: Request, res: Response) => {
  const { code_login } = req.body;

  const serve_session = await serve_session_model
    .findOne({ code_login, ended_at: { $eq: null } })
    .populate('table_ids');

  if (!serve_session) {
    return res.status(404).json({ message: 'Serve session not found or already ended' });
  }

  return res.status(200).json(serve_session);
};

export const auth_controller = {
  codeLoginSession,
};
