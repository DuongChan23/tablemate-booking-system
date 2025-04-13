
import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'admin' | 'user'; // Added explicit role field matching the backend
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'user';
  }
}

const authService = {
  login: async (credentials: LoginCredentials) => {
    // This would be an actual API call in production
    // For now, simulate a successful login with mock data
    // In real implementation, this would call /api/auth/login
    return {
      token: 'mock_token_12345',
      user: {
        id: '1',
        email: credentials.email,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin' as const
      }
    };
  },
  
  register: async (data: RegisterData) => {
    // This would be an actual API call in production
    // For now, simulate a successful registration
    // In real implementation, this would call /api/auth/register
    return {
      token: 'mock_token_12345',
      user: {
        id: '1',
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'user' as const
      }
    };
  },
  
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }
};

export default authService;
