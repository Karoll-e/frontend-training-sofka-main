// src/controllers/dashboard.controller.ts
import { Request, Response, NextFunction } from 'express';
import cuentaService from '../services/cuenta.service';
import transaccionService from '../services/transaccion.service';
import { TipoTransaccion } from '../types/transaccion.types';

export class DashboardController {
  
  /**
   * GET /dashboard - Vista overview del dashboard
   */
  async overview(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = req.session.usuario!.id;
      const nombreUsuario = req.session.usuario!.nombre;

      // Obtener todas las cuentas del usuario
      const cuentas = await cuentaService.getCuentasByUsuario(usuarioId);

      // Obtener la cuenta principal (primera cuenta creada)
      const cuentaPrincipal = cuentas.length > 0 ? cuentas[0] : null;

      // Calcular balance total
      const balanceTotal = cuentas.reduce((total, cuenta) => total + cuenta.saldoActual, 0);

      // Obtener últimas transacciones de todas las cuentas
      const ultimasTransacciones = [];
      for (const cuenta of cuentas) {
        const transacciones = await transaccionService.getTransaccionesByCuenta(cuenta.id);
        // Agregar info de la cuenta a cada transacción
        const transaccionesConCuenta = transacciones.map(tx => ({
          ...tx,
          numeroCuenta: cuenta.numeroCuenta
        }));
        ultimasTransacciones.push(...transaccionesConCuenta);
      }

      // Ordenar por fecha (más recientes primero) y tomar las últimas 5
      ultimasTransacciones.sort((a, b) => 
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      const top5Transacciones = ultimasTransacciones.slice(0, 5);

      // Contar transacciones por tipo
      const totalDepositos = ultimasTransacciones.filter(
        tx => tx.tipo === TipoTransaccion.DEPOSITO
      ).length;
      const totalRetiros = ultimasTransacciones.filter(
        tx => tx.tipo === TipoTransaccion.RETIRO
      ).length;
      const totalTransferencias = ultimasTransacciones.filter(
        tx => tx.tipo === TipoTransaccion.TRANSFERENCIA
      ).length;

      res.render('dashboard/overview', {
        layout: 'layouts/dashboard',
        title: 'Dashboard',
        pageTitle: 'Panel',
        usuario: nombreUsuario,
        balanceTotal,
        cuentaPrincipal,
        cuentas,
        ultimasTransacciones: top5Transacciones,
        estadisticas: {
          totalCuentas: cuentas.length,
          totalDepositos,
          totalRetiros,
          totalTransferencias
        }
      });

    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();