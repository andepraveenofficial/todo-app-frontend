// src/services/auth.ts
import { api } from './api';

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/auth/signin', { email, password });
  const { refreshToken } = response.data;
  localStorage.setItem('token', refreshToken);
};

export const signupUser = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await api.post('/auth/signup', { name, email, password });
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
};
