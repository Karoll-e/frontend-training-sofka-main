// src/controllers/cuenta.controller.ts
import { Request, Response, NextFunction } from 'express';
import cuentaService from '../services/cuenta.service';
import transaccionService from '../services/transaccion.service';
import accountGeneratorService from '../services/accountGenerator.service';
import { CreateCuentaDTO } from '../types/cuenta.types';

export class CuentaController {
  
  /**
   * GET /dashboard/cuentas - Listar todas las cuentas del usuario
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = req.session.usuario!.id;
      const nombreUsuario = req.session.usuario!.nombre;
      const cuentas = await cuentaService.getCuentasByUsuario(usuarioId);

      res.render('dashboard/cuentas/list', {
        layout: 'layouts/dashboard',
        title: 'Mis Cuentas',
        pageTitle: 'Mis Cuentas',
        usuario: nombreUsuario,
        currentPath: '/dashboard/cuentas',
        cuentas,
        success: req.query.success || null,
        error: req.query.error || null
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /dashboard/cuentas/crear - Mostrar formulario de crear cuenta
   */
  showCreate(req: Request, res: Response) {
    const nombreUsuario = req.session.usuario!.nombre;
    
    res.render('dashboard/cuentas/create', {
      layout: 'layouts/dashboard',
      title: 'Crear Nueva Cuenta',
      pageTitle: 'Crear Nueva Cuenta',
      usuario: nombreUsuario,
      currentPath: '/dashboard/cuentas',
      error: null
    });
  }

  /**
   * POST /dashboard/cuentas - Crear nueva cuenta
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { saldoInicial } = req.body;
      const usuarioId = req.session.usuario!.id;
      const nombreUsuario = req.session.usuario!.nombre;

      // Validaciones
      if (saldoInicial === undefined) {
        return res.render('dashboard/cuentas/create', {
          layout: 'layouts/dashboard',
          title: 'Crear Nueva Cuenta',
          pageTitle: 'Crear Nueva Cuenta',
          usuario: nombreUsuario,
          currentPath: '/dashboard/cuentas',
          error: 'El saldo inicial es obligatorio'
        });
      }

      // Validar saldo inicial
      const saldo = parseFloat(saldoInicial);
      if (isNaN(saldo) || saldo < 0) {
        return res.render('dashboard/cuentas/create', {
          layout: 'layouts/dashboard',
          title: 'Crear Nueva Cuenta',
          pageTitle: 'Crear Nueva Cuenta',
          usuario: nombreUsuario,
          currentPath: '/dashboard/cuentas',
          error: 'El saldo inicial debe ser un número positivo'
        });
      }

      // Generar número de cuenta único automáticamente
      let numeroCuenta: string;
      try {
        numeroCuenta = await accountGeneratorService.generateUniqueAccountNumber();
      } catch (error) {
        return res.render('dashboard/cuentas/create', {
          layout: 'layouts/dashboard',
          title: 'Crear Nueva Cuenta',
          pageTitle: 'Crear Nueva Cuenta',
          usuario: nombreUsuario,
          currentPath: '/dashboard/cuentas',
          error: 'Error al generar el número de cuenta. Por favor intenta de nuevo.'
        });
      }

      // Crear cuenta
      const cuentaData: CreateCuentaDTO = {
        numeroCuenta,
        saldoActual: saldo,
        usuarioId
      };

      await cuentaService.create(cuentaData);

      // Redirigir con mensaje de éxito
      res.redirect('/dashboard/cuentas?success=Cuenta creada exitosamente');

    } catch (error: any) {
      const nombreUsuario = req.session.usuario!.nombre;
      if (error.response?.status === 400) {
        return res.render('dashboard/cuentas/create', {
          layout: 'layouts/dashboard',
          title: 'Crear Nueva Cuenta',
          pageTitle: 'Crear Nueva Cuenta',
          usuario: nombreUsuario,
          currentPath: '/dashboard/cuentas',
          error: error.response.data.message || 'Error al crear la cuenta'
        });
      }
      next(error);
    }
  }

  /**
   * GET /dashboard/cuentas/:id - Ver detalle de una cuenta
   */
  async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const cuentaId = parseInt(req.params.id);
      const usuarioId = req.session.usuario!.id;
      const nombreUsuario = req.session.usuario!.nombre;

      // Obtener cuenta - use getCuentasByUsuario to verify ownership
      const cuentasUsuario = await cuentaService.getCuentasByUsuario(usuarioId);
      const cuenta = cuentasUsuario.find(c => c.id === cuentaId);

      // Verificar que la cuenta pertenece al usuario autenticado
      if (!cuenta) {
        return res.status(403).render('pages/error', {
          layout: 'layouts/main',
          error: 'No tienes permiso para ver esta cuenta',
          statusCode: 403
        });
      }

      // Obtener historial de transacciones
      const transacciones = await transaccionService.getTransaccionesByCuenta(cuentaId);

      // Ordenar por fecha (más recientes primero)
      transacciones.sort((a, b) => 
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );

      res.render('dashboard/cuentas/detail', {
        layout: 'layouts/dashboard',
        title: `Cuenta ${cuenta.numeroCuenta}`,
        pageTitle: `Cuenta ${cuenta.numeroCuenta}`,
        usuario: nombreUsuario,
        currentPath: '/dashboard/cuentas',
        cuenta,
        transacciones,
        success: req.query.success || null,
        error: req.query.error || null
      });

    } catch (error: any) {
      if (error.response?.status === 404) {
        return res.status(404).render('pages/error', {
          layout: 'layouts/main',
          error: 'Cuenta no encontrada',
          statusCode: 404
        });
      }
      next(error);
    }
  }

  /**
   * POST /dashboard/cuentas/:id/eliminar - Eliminar cuenta
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const cuentaId = parseInt(req.params.id);
      const usuarioId = req.session.usuario!.id;

      // Verificar que la cuenta pertenece al usuario
      // Use getCuentasByUsuario to verify ownership
      const cuentasUsuario = await cuentaService.getCuentasByUsuario(usuarioId);
      const cuenta = cuentasUsuario.find(c => c.id === cuentaId);
      
      if (!cuenta) {
        return res.status(403).redirect('/dashboard/cuentas?error=No tienes permiso para eliminar esta cuenta');
      }

      // Verificar que la cuenta tenga saldo 0
      if (cuenta.saldoActual > 0) {
        return res.redirect(`/dashboard/cuentas?error=No puedes eliminar una cuenta con saldo. Retira el dinero primero`);
      }

      // Eliminar cuenta
      await cuentaService.delete(cuentaId);

      res.redirect('/dashboard/cuentas?success=Cuenta eliminada exitosamente');

    } catch (error: any) {
      if (error.response?.status === 404) {
        return res.redirect('/dashboard/cuentas?error=Cuenta no encontrada');
      }
      next(error);
    }
  }
}

export default new CuentaController();