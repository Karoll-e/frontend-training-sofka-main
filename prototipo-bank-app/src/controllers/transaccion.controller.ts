import { Request, Response, NextFunction } from 'express';
import cuentaService from '../services/cuenta.service';
import transaccionService from '../services/transaccion.service';
import { CreateTransaccionDTO, CreateTransferenciaDTO, TipoTransaccion } from '../types/transaccion.types';

export class TransaccionController {
  
  /**
   * GET /dashboard/transferencias - Página de transferencias
   */
  async showTransferencias(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = req.session.usuario!.id;
      const nombreUsuario = req.session.usuario!.nombre;

      // Obtener cuentas del usuario para el selector
      const cuentas = await cuentaService.getCuentasByUsuario(usuarioId);

      res.render('dashboard/transferencias/index', {
        layout: 'layouts/dashboard',
        title: 'Transferencias',
        pageTitle: 'Transferencias',
        usuario: nombreUsuario,
        currentPath: '/dashboard/transferencias',
        cuentas,
        success: req.query.success || null,
        error: req.query.error || null
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /dashboard/transacciones - Página de todas las transacciones
   */
  async showTransacciones(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = req.session.usuario!.id;
      const nombreUsuario = req.session.usuario!.nombre;

      // Obtener todas las cuentas del usuario
      const cuentas = await cuentaService.getCuentasByUsuario(usuarioId);

      // Obtener todas las transacciones de todas las cuentas
      const todasTransacciones = [];
      for (const cuenta of cuentas) {
        const transacciones = await transaccionService.getTransaccionesByCuenta(cuenta.id);
        // Agregar info de la cuenta a cada transacción
        const transaccionesConCuenta = transacciones.map(tx => ({
          ...tx,
          numeroCuenta: cuenta.numeroCuenta
        }));
        todasTransacciones.push(...transaccionesConCuenta);
      }

      // Ordenar por fecha (más recientes primero)
      todasTransacciones.sort((a, b) => 
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );

      res.render('dashboard/transferencias/historial', {
        layout: 'layouts/dashboard',
        title: 'Historial de Transacciones',
        pageTitle: 'Historial de Transacciones',
        usuario: nombreUsuario,
        currentPath: '/dashboard/transacciones',
        transacciones: todasTransacciones,
        success: req.query.success || null,
        error: req.query.error || null
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /dashboard/transferencias - Crear transferencia
   */
  async createTransferencia(req: Request, res: Response, next: NextFunction) {
    try {
      const { cuentaOrigenId, numeroCuentaDestino, monto } = req.body;
      const usuarioId = req.session.usuario!.id;

      // Validaciones básicas
      if (!cuentaOrigenId || !numeroCuentaDestino || !monto) {
        return res.redirect('/dashboard/transferencias?error=Todos los campos son obligatorios');
      }

      // Validar monto
      const montoNum = parseFloat(monto);
      if (isNaN(montoNum) || montoNum <= 0) {
        return res.redirect('/dashboard/transferencias?error=El monto debe ser un número positivo');
      }

      // Verificar que cuenta origen pertenece al usuario
      // Workaround: Get all user accounts since /cuentas/{id}/saldo might not return usuarioId
      const cuentasUsuario = await cuentaService.getCuentasByUsuario(usuarioId);
      const cuentaOrigen = cuentasUsuario.find(c => c.id === parseInt(cuentaOrigenId));
      
      if (!cuentaOrigen) {
        console.log('Account not found in user accounts:', { 
          cuentaOrigenId, 
          usuarioId,
          cuentasUsuario: cuentasUsuario.map(c => c.id)
        });
        return res.redirect('/dashboard/transferencias?error=No tienes permiso para usar esta cuenta');
      }

      // Verificar saldo suficiente
      if (cuentaOrigen.saldoActual < montoNum) {
        return res.redirect('/dashboard/transferencias?error=Saldo insuficiente');
      }

      // Buscar cuenta destino por número de cuenta
      const cuentaDestino = await cuentaService.findByNumeroCuenta(numeroCuentaDestino);

      if (!cuentaDestino) {
        return res.redirect('/dashboard/transferencias?error=Cuenta destino no encontrada');
      }

      // Verificar que no sea la misma cuenta
      if (cuentaOrigen.id === cuentaDestino.id) {
        return res.redirect('/dashboard/transferencias?error=No puedes transferir a la misma cuenta');
      }

      // Crear transferencia
      const transferenciaData: CreateTransferenciaDTO = {
        cuentaOrigenId: cuentaOrigen.id,
        cuentaDestinoId: cuentaDestino.id,
        monto: montoNum
      };

      await transaccionService.createTransferencia(transferenciaData);

      res.redirect('/dashboard/transferencias?success=Transferencia realizada exitosamente');

    } catch (error: any) {
      if (error.response?.status === 400) {
        return res.redirect(`/dashboard/transferencias?error=${error.response.data.message || 'Error al realizar la transferencia'}`);
      }
      next(error);
    }
  }

  /**
   * GET /dashboard/cuentas/:id/transaccion - Formulario nueva transacción (depósito/retiro)
   */
  async showNuevaTransaccion(req: Request, res: Response, next: NextFunction) {
    try {
      const cuentaId = parseInt(req.params.id);
      const usuarioId = req.session.usuario!.id;
      const nombreUsuario = req.session.usuario!.nombre;

      // Obtener cuenta - use getCuentasByUsuario to verify ownership
      const cuentasUsuario = await cuentaService.getCuentasByUsuario(usuarioId);
      const cuenta = cuentasUsuario.find(c => c.id === cuentaId);

      // Verificar que pertenece al usuario
      if (!cuenta) {
        return res.status(403).render('pages/error', {
          layout: 'layouts/main',
          error: 'No tienes permiso para acceder a esta cuenta',
          statusCode: 403
        });
      }

      res.render('dashboard/cuentas/transaccion', {
        layout: 'layouts/dashboard',
        title: 'Nueva Transacción',
        pageTitle: 'Nueva Transacción',
        usuario: nombreUsuario,
        currentPath: '/dashboard/cuentas',
        cuenta,
        success: req.query.success || null,
        error: req.query.error || null
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /dashboard/transacciones - Crear transacción (depósito/retiro)
   */
  async createTransaccion(req: Request, res: Response, next: NextFunction) {
    try {
      const { cuentaBancariaId, tipo, monto } = req.body;
      const usuarioId = req.session.usuario!.id;

      // Validaciones
      if (!cuentaBancariaId || !tipo || !monto) {
        return res.redirect(`/dashboard/cuentas/${cuentaBancariaId}?error=Todos los campos son obligatorios`);
      }

      const montoNum = parseFloat(monto);
      if (isNaN(montoNum) || montoNum <= 0) {
        return res.redirect(`/dashboard/cuentas/${cuentaBancariaId}?error=El monto debe ser un número positivo`);
      }

      // Validar tipo
      if (tipo !== TipoTransaccion.DEPOSITO && tipo !== TipoTransaccion.RETIRO) {
        return res.redirect(`/dashboard/cuentas/${cuentaBancariaId}?error=Tipo de transacción inválido`);
      }

      // Verificar que cuenta pertenece al usuario
      // Use getCuentasByUsuario to verify ownership
      const cuentasUsuario = await cuentaService.getCuentasByUsuario(usuarioId);
      const cuenta = cuentasUsuario.find(c => c.id === parseInt(cuentaBancariaId));
      
      if (!cuenta) {
        console.log('Account not found in user accounts:', { 
          cuentaBancariaId, 
          usuarioId,
          cuentasUsuario: cuentasUsuario.map(c => c.id)
        });
        return res.redirect('/dashboard/cuentas?error=No tienes permiso para usar esta cuenta');
      }

      // Si es retiro, verificar saldo
      if (tipo === TipoTransaccion.RETIRO && cuenta.saldoActual < montoNum) {
        return res.redirect(`/dashboard/cuentas/${cuentaBancariaId}?error=Saldo insuficiente`);
      }

      // Crear transacción
      const transaccionData: CreateTransaccionDTO = {
        cuentaBancariaId: parseInt(cuentaBancariaId),
        monto: montoNum,
        tipo: tipo as TipoTransaccion
      };

      await transaccionService.create(transaccionData);

      const mensaje = tipo === TipoTransaccion.DEPOSITO ? 'Depósito' : 'Retiro';
      res.redirect(`/dashboard/cuentas/${cuentaBancariaId}?success=${mensaje} realizado exitosamente`);

    } catch (error: any) {
      const cuentaId = req.body.cuentaBancariaId;
      if (error.response?.status === 400) {
        return res.redirect(`/dashboard/cuentas/${cuentaId}?error=${error.response.data.message || 'Error al realizar la transacción'}`);
      }
      next(error);
    }
  }
}

export default new TransaccionController();