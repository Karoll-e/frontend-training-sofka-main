// src/services/cuenta.service.ts
import apiClient from '../config/axios.config';
import { CuentaBancaria, CreateCuentaDTO } from '../types/cuenta.types';

export class CuentaService {
  
  async getCuentasByUsuario(usuarioId: number): Promise<CuentaBancaria[]> {
    const response = await apiClient.get<CuentaBancaria[]>(`/cuentas/usuario/${usuarioId}`);
    return response.data;
  }

  async getById(id: number): Promise<CuentaBancaria> {
    const response = await apiClient.get<CuentaBancaria>(`/cuentas/${id}/saldo`);
    return response.data;
  }

  async create(data: CreateCuentaDTO): Promise<CuentaBancaria> {
    const response = await apiClient.post<CuentaBancaria>('/cuentas', data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/cuentas/${id}`);
  }

  async findByNumeroCuenta(numeroCuenta: string): Promise<CuentaBancaria | null> {
    try {
      const response = await apiClient.get<CuentaBancaria>(`/cuentas/numero/${numeroCuenta}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
}

export default new CuentaService();