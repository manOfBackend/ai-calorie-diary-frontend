// src/stores/authStore.ts

import create from 'zustand';

import api from '../api/axios';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { user, accessToken } = response.data;
    localStorage.setItem('token', accessToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    set({ isAuthenticated: true, user });
  },
  register: async (email, password) => {
    const response = await api.post('/auth/register', { email, password });
    const { user, accessToken } = response.data;
    localStorage.setItem('token', accessToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    set({ isAuthenticated: true, user });
  },
  logout: () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    set({ isAuthenticated: false, user: null });
  },
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/auth/me');
        set({ isAuthenticated: true, user: response.data, isLoading: false });
      } catch (error) {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        set({ isAuthenticated: false, user: null, isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));
