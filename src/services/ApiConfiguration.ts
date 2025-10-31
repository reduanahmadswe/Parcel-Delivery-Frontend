import axios from 'axios';
import { TokenManager } from './TokenManager';

// Direct API URL to avoid configuration issues
const API_BASE_URL = 'https://parcel-delivery-api.onrender.com/api';

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

    // Avoid attempting to refresh if the failed request was the refresh endpoint itself
    if (originalRequest?.url?.includes('/auth/refresh-token')) {
      TokenManager.clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
          const refreshToken = TokenManager.getRefreshToken();

          // If we don't have a refresh token, clear and redirect
          if (!refreshToken) {
            TokenManager.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(error);
          }

          // Use the plain axios (not our instance) to call refresh so we don't trigger
          // the same interceptors and create a loop. Send the refresh token in the body.
          const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });

          // Update the access token (and refresh token if returned)
          if (refreshResponse.data?.accessToken) {
            TokenManager.setTokens(
              refreshResponse.data.accessToken,
              refreshResponse.data?.refreshToken || refreshToken
            );
          } else {
            // No access token returned: treat as failure
            TokenManager.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshResponse);
          }

          // Set the Authorization header for the original request and retry
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${TokenManager.getAccessToken()}`;
          return api(originalRequest);
      } catch (refreshError: any) {
        // Refresh failed, clear tokens and redirect to login
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
