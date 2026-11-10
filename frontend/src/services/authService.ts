import { request } from './api.js';
import { User } from '../types/index.js';

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export const authService = {
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const res = await request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    localStorage.setItem('testtruth_token', res.token);
    localStorage.setItem('testtruth_user', JSON.stringify(res.user));
    return res;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('testtruth_token', res.token);
    localStorage.setItem('testtruth_user', JSON.stringify(res.user));
    return res;
  },

  async getCurrentUser(): Promise<User> {
    const res = await request<{ user: User }>('/auth/me', {
      method: 'GET',
    });
    localStorage.setItem('testtruth_user', JSON.stringify(res.user));
    return res.user;
  },

  logout(): void {
    localStorage.removeItem('testtruth_token');
    localStorage.removeItem('testtruth_user');
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('testtruth_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('testtruth_token');
  },
};

