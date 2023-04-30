import { Request } from 'express';

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  avatar: string;
  roles: string[];
  sessionId: string;
}

export interface AuthRequest extends Request {
  user: JwtPayload;
}
