export interface Usuario {
  id: number;
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

export interface CreateUsuarioDTO {
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  password: string; 
}

export interface UpdateUsuarioDTO {
  cedula?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
}

export interface LoginRequestDTO {
  cedula: string;
  password: string;
}

export interface LoginResponseDTO {
  id: number;
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}