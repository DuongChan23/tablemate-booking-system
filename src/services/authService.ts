
import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string; // Changed from firstName/lastName to name
  email: string;
  password: string;
  phone?: string;
  role: string; // Default to "customer"
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string; // Changed from firstName/lastName to name
    email: string;
    role: string;
  }
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Using the correct endpoint from the image: /api/Auth/login
    const response = await api.post('/Auth/login', credentials);
    
    // Store token and user data in localStorage
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  },
  
  register: async (data: RegisterData): Promise<AuthResponse> => {
    // Set role to "customer" by default if not provided
    const registerData = {
      ...data,
      role: data.role || "customer"
    };

    // Using the correct endpoint from the image: /api/Auth/register
    const response = await api.post('/Auth/register', registerData);
    
    // Store token and user data in localStorage
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
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
