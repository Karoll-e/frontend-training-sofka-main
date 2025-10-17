export interface CuentaBancaria {
  id: number;
  numeroCuenta: string;
  saldoActual: number;
  usuarioId: number;
}

export interface CreateCuentaDTO {
  numeroCuenta: string;
  saldoActual: number;
  usuarioId: number;
}