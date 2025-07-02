import axios from 'axios';
import { store } from '@/app/store';
import { login, logout } from '@/features/auth/authSlice';
import type { User } from '@/types/user';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          'http://localhost:4000/auth/refresh',
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;

        // Get persisted user from localStorage
        const persistedAuth = localStorage.getItem('auth');
        const persistedUser: User | null = persistedAuth
          ? JSON.parse(persistedAuth).user
          : null;

        if (!persistedUser) {
          store.dispatch(logout());
          throw new Error('Missing user data during token refresh');
        }

        store.dispatch(login({
          user: persistedUser,
          token: newAccessToken,
        }));

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest); // Retry original request
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
