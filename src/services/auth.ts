import instance from '../api/axios';
import { AuthResponse } from '../types';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await instance.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
};

export const register = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await instance.post<AuthResponse>('/auth/register', { email, password });
  return response.data;
};

export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await instance.post<AuthResponse>('/auth/refresh-token', { refreshToken });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await instance.post('/auth/logout');
};
