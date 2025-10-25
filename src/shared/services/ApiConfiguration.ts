import axios from 'axios';
import { TokenManager } from './TokenManager';
import { API_BASE } from '../constants/config';

const API_BASE_URL = API_BASE;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true, // Removed - we use Bearer tokens, not cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = TokenManager.getAccessToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
          const refreshResponse = await api.post('/auth/refresh-token');

          // Update the access token if provided
          if (refreshResponse.data?.accessToken) {
            TokenManager.setTokens(
              refreshResponse.data.accessToken,
              TokenManager.getRefreshToken() || undefined
            );
          }

          return api(originalRequest);
      } catch (refreshError: any) {
        // Refresh failed, redirect to login
        TokenManager.clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
