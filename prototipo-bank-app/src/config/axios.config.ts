// src/config/axios.config.ts
import axios from 'axios';

const baseURL = process.env.API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Interceptor de errores
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;