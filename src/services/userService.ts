
import api from './api';
import { User } from '@/types';

// Define a type for creating a user that accepts password instead of passwordHash
type CreateUserData = Omit<User, 'id' | 'createdAt' | 'passwordHash'> & {
  password: string;
};

const userService = {
  getAll: async (): Promise<User[]> => {
    // Using the correct endpoint from the image: /api/User
    const response = await api.get('/User');
    return response.data;
  },
  
  getById: async (id: string): Promise<User> => {
    // Using the correct endpoint from the image: /api/User/{id}
    const response = await api.get(`/User/${id}`);
    return response.data;
  },
  
  create: async (userData: CreateUserData): Promise<User> => {
    // Set role to "customer" by default if not provided
    const userDataWithRole = {
      ...userData,
      role: userData.role || "customer"
    };
    
    // Using the correct endpoint from the image: /api/User
    const response = await api.post('/User', userDataWithRole);
    return response.data;
  },
  
  update: async (id: string, userData: Partial<User> | { password?: string }): Promise<User> => {
    // Using the correct endpoint from the image: /api/User/{id}
    const response = await api.put(`/User/${id}`, userData);
    return response.data;
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    // Using the correct endpoint from the image: /api/User/{id}
    await api.delete(`/User/${id}`);
    return { success: true };
  }
};

export default userService;
