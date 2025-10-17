// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { LoginRequestDTO, CreateUsuarioDTO } from '../types/usuario.types';

export class AuthController {
  
  /**
   * GET / - Mostrar landing page
   */
  showLanding(req: Request, res: Response) {
    // Si ya está autenticado, redirigir al dashboard
    if (req.session.usuario) {
      return res.redirect('/dashboard');
    }
    res.render('pages/landing', {
      title: 'Bienvenido a BankPro'
    });
  }

  /**
   * GET /login - Mostrar formulario de login
   */
  showLogin(req: Request, res: Response) {
    // Si ya está autenticado, redirigir al dashboard
    if (req.session.usuario) {
      return res.redirect('/dashboard');
    }
    res.render('pages/login', {
      title: 'Iniciar Sesión',
      error: null
    });
  }

  /**
   * POST /login - Procesar login
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { cedula, password } = req.body;

      // Validación básica
      if (!cedula || !password) {
        return res.render('pages/login', {
          title: 'Iniciar Sesión',
          error: 'Por favor ingrese cédula y contraseña'
        });
      }

      // Validar credenciales contra la API
      const credentials: LoginRequestDTO = { cedula, password };
      const usuario = await authService.login(credentials);

      // Si credenciales inválidas
      if (!usuario) {
        return res.render('pages/login', {
          title: 'Iniciar Sesión',
          error: 'Cédula o contraseña incorrectos'
        });
      }

      // Guardar en sesión
      req.session.usuario = {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre
      };

      // Redirigir al dashboard
      res.redirect('/dashboard');

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /register - Mostrar formulario de registro
   */
  showRegister(req: Request, res: Response) {
    // Si ya está autenticado, redirigir al dashboard
    if (req.session.usuario) {
      return res.redirect('/dashboard');
    }
    res.render('pages/register', {
      title: 'Crear Cuenta',
      error: null
    });
  }

  /**
   * POST /register - Procesar registro
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { cedula, nombre, apellido, email, telefono, password, confirmPassword } = req.body;

      // Validaciones básicas
      if (!cedula || !nombre || !apellido || !email || !telefono || !password) {
        return res.render('pages/register', {
          title: 'Crear Cuenta',
          error: 'Todos los campos son obligatorios'
        });
      }

      // Validar que las contraseñas coincidan
      if (password !== confirmPassword) {
        return res.render('pages/register', {
          title: 'Crear Cuenta',
          error: 'Las contraseñas no coinciden'
        });
      }

      // Validar longitud mínima de contraseña
      if (password.length < 8) {
        return res.render('pages/register', {
          title: 'Crear Cuenta',
          error: 'La contraseña debe tener al menos 8 caracteres'
        });
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.render('pages/register', {
          title: 'Crear Cuenta',
          error: 'Email inválido'
        });
      }

      // Crear usuario en la API
      const userData: CreateUsuarioDTO = {
        cedula,
        nombre,
        apellido,
        email,
        telefono,
        password
      };

      const usuario = await authService.register(userData);

      // Login automático después del registro
      req.session.usuario = {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre
      };

      // Redirigir al dashboard
      res.redirect('/dashboard');

    } catch (error: any) {
      // Manejar errores específicos de la API
      if (error.response?.status === 400) {
        return res.render('pages/register', {
          title: 'Crear Cuenta',
          error: error.response.data.message || 'Error al crear la cuenta'
        });
      }
      next(error);
    }
  }

  /**
   * POST /logout - Cerrar sesión
   */
  logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
      }
      res.redirect('/');
    });
  }
}

export default new AuthController();