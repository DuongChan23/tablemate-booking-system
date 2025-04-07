
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
    return {
      token: 'mock_token_12345',
      user: {
        id: '1',
        email: credentials.email,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      }
    };
  },
  
  register: async (data: RegisterData) => {
    // This would be an actual API call in production
    // For now, simulate a successful registration
    return {
      token: 'mock_token_12345',
      user: {
        id: '1',
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'user'
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
