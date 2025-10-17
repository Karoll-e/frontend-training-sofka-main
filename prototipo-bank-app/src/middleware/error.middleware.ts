import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  
  const statusCode = err.response?.status || 500;
  const message = err.response?.data?.message || err.message || 'Error interno del servidor';
  
  res.status(statusCode).render('pages/error', {
    title: statusCode === 404 ? 'Página no encontrada' : 'Error',
    error: message,
    statusCode
  });
}