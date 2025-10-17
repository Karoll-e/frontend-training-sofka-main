export enum TipoTransaccion {
  DEPOSITO = 'DEPOSITO',
  RETIRO = 'RETIRO',
  TRANSFERENCIA = 'TRANSFERENCIA'
}

export interface Transaccion {
  id: number;
  monto: number;
  tipo: TipoTransaccion;
  fecha: string;
  cuentaBancariaId: number;
  cuentaDestinoId?: number;
}

export interface CreateTransaccionDTO {
  cuentaBancariaId: number;
  monto: number;
  tipo: TipoTransaccion;
}

export interface CreateTransferenciaDTO {
  cuentaOrigenId: number;
  cuentaDestinoId: number;
  monto: number;
}