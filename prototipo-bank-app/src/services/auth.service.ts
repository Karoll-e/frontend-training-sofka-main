// src/services/auth.service.ts
import apiClient from '../config/axios.config';
import { LoginRequestDTO, LoginResponseDTO, CreateUsuarioDTO } from '../types/usuario.types';
import accountGeneratorService from './accountGenerator.service';
import cuentaService from './cuenta.service';

export class AuthService {
  
  /**
   * Login: valida credenciales contra la API
   */
  async login(credentials: LoginRequestDTO): Promise<LoginResponseDTO | null> {
    try {
      const response = await apiClient.post<LoginResponseDTO>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        return null; // Credenciales inválidas
      }
      throw error; // Otro tipo de error
    }
  }

  /**
   * Register: crea usuario con password hasheado en backend
   * y automáticamente crea una cuenta bancaria con número único
   */
  async register(userData: CreateUsuarioDTO): Promise<LoginResponseDTO> {
    // 1. Crear el usuario
    const response = await apiClient.post<LoginResponseDTO>('/auth/register', userData);
    const usuario = response.data;
    
    try {
      // 2. Generar número de cuenta único
      const accountNumber = await accountGeneratorService.generateUniqueAccountNumber();
      
      // 3. Crear cuenta bancaria automáticamente con saldo inicial de 0
      await cuentaService.create({
        numeroCuenta: accountNumber,
        saldoActual: 0,
        usuarioId: usuario.id
      });
      
      console.log(`Account ${accountNumber} created automatically for user ${usuario.id}`);
    } catch (accountError) {
      // Log error but don't fail registration
      // User was created successfully, account creation can be retried later
      console.error('Error creating automatic account:', accountError);
      // Optionally: you could throw here if account creation is critical
      // throw new Error('User created but account creation failed');
    }
    
    return usuario;
  }
}

export default new AuthService();