import axios from 'axios';
import { getToken, clearAuth } from '../utils/authStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCall = error.config?.url?.includes('/api/auth/login') ||
      error.config?.url?.includes('/api/auth/register');

    // Expired / invalid JWT → sign out and go to login
    if (error.response?.status === 401 && !isAuthCall) {
      clearAuth();
      window.location.href = '/login';
    }

    // Network error (server down, CORS, offline) → give a readable message
    if (!error.response) {
      error.response = {
        status: 0,
        data: { message: 'Network error — cannot reach the server. Please try again.' },
      };
    }
    return Promise.reject(error);
  }
);

export default api;
