// src/services/transaccion.service.ts
import apiClient from '../config/axios.config';
import { Transaccion, CreateTransaccionDTO, CreateTransferenciaDTO } from '../types/transaccion.types';

export class TransaccionService {
  
  async getTransaccionesByCuenta(cuentaId: number): Promise<Transaccion[]> {
    const response = await apiClient.get<Transaccion[]>(`/transacciones/cuenta/${cuentaId}`);
    return response.data;
  }

  async create(data: CreateTransaccionDTO): Promise<Transaccion> {
    const response = await apiClient.post<Transaccion>('/transacciones', data);
    return response.data;
  }

  async createTransferencia(data: CreateTransferenciaDTO): Promise<Transaccion> {
    const response = await apiClient.post<Transaccion>('/transacciones/transferencia', data);
    return response.data;
  }
}

export default new TransaccionService();