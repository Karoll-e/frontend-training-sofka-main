// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

/**
 * Montar rutas públicas (autenticación)
 */
router.use('/', authRoutes);

/**
 * Montar rutas protegidas (dashboard)
 */
router.use('/dashboard', dashboardRoutes);

/**
 * Ruta 404 - No encontrada
 */
router.use((req, res) => {
  res.status(404).render('pages/error', {
    title: 'Página no encontrada',
    error: 'La página que buscas no existe',
    statusCode: 404
  });
});

export default router;