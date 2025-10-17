// src/routes/dashboard.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import dashboardController from '../controllers/dashboard.controller';
import cuentaController from '../controllers/cuenta.controller';
import transaccionController from '../controllers/transaccion.controller';

const router = Router();

/**
 * Aplicar middleware de autenticación a todas las rutas del dashboard
 */
router.use(requireAuth);

/**
 * DASHBOARD OVERVIEW
 */
router.get('/', dashboardController.overview);

/**
 * CUENTAS
 */
// Listar cuentas
router.get('/cuentas', cuentaController.list);

// Crear cuenta
router.get('/cuentas/crear', cuentaController.showCreate);
router.post('/cuentas', cuentaController.create);

// Ver detalle de cuenta (debe ir después de /cuentas/crear para evitar conflictos)
router.get('/cuentas/:id', cuentaController.detail);

// Eliminar cuenta
router.post('/cuentas/:id/eliminar', cuentaController.delete);

// Nueva transacción (depósito/retiro) en una cuenta específica
router.get('/cuentas/:id/transaccion', transaccionController.showNuevaTransaccion);

/**
 * TRANSACCIONES Y TRANSFERENCIAS
 */
// Página de todas las transacciones
router.get('/transacciones', transaccionController.showTransacciones);

// Crear transacción (depósito/retiro)
router.post('/transacciones', transaccionController.createTransaccion);

// Página de transferencias
router.get('/transferencias', transaccionController.showTransferencias);
router.post('/transferencias', transaccionController.createTransferencia);

export default router;