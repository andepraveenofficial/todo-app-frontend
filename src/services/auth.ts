// src/services/auth.ts
import { api } from './api';

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/auth/signin', { email, password });
  const { token } = response.data;
  localStorage.setItem('token', token);
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
