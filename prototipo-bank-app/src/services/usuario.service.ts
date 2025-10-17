// src/services/usuario.service.ts
import apiClient from '../config/axios.config';
import { Usuario, CreateUsuarioDTO, UpdateUsuarioDTO } from '../types/usuario.types';

export class UsuarioService {
  
  async getAll(): Promise<Usuario[]> {
    const response = await apiClient.get<Usuario[]>('/usuarios');
    return response.data;
  }

  async getById(id: number): Promise<Usuario> {
    const response = await apiClient.get<Usuario>(`/usuarios/${id}`);
    return response.data;
  }

  async create(data: CreateUsuarioDTO): Promise<Usuario> {
    // NOTA: Este endpoint ahora requiere password
    // Es mejor usar /auth/register para crear usuarios desde el frontend
    const response = await apiClient.post<Usuario>('/usuarios', data);
    return response.data;
  }

  async update(id: number, data: UpdateUsuarioDTO): Promise<Usuario> {
    const response = await apiClient.put<Usuario>(`/usuarios/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/usuarios/${id}`);
  }

  // Este método ya no es necesario si usamos /auth/login
  // async findByEmail(email: string): Promise<Usuario | null> {
  //   const usuarios = await this.getAll();
  //   return usuarios.find(u => u.email === email) || null;
  // }
}

export default new UsuarioService();