import { Request, Response, NextFunction } from 'express';

declare module 'express-session' {
  interface SessionData {
    usuario: {
      id: number;
      email: string;
      nombre: string;
    };
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }
  next();
}

export function requireGuest(req: Request, res: Response, next: NextFunction) {
  if (req.session.usuario) {
    return res.redirect('/dashboard');
  }
  next();
}