// src/routes/auth.routes.ts
import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { requireGuest } from '../middleware/auth.middleware';

const router = Router();

/**
 * Rutas públicas (solo accesibles si NO estás autenticado)
 */

// Landing page
router.get('/', authController.showLanding);

// Login
router.get('/login', requireGuest, authController.showLogin);
router.post('/login', requireGuest, authController.login);

// Registro
router.get('/register', requireGuest, authController.showRegister);
router.post('/register', requireGuest, authController.register);

// Logout (accesible solo si estás autenticado)
router.post('/logout', authController.logout);

export default router;