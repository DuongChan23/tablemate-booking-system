
import api from './api';
import { User } from '@/types';

const userService = {
  getAll: async (): Promise<User[]> => {
    // Using the correct endpoint from Swagger: /api/User
    const response = await api.get('/User');
    return response.data;
  },
  
  getById: async (id: string): Promise<User> => {
    // Using the correct endpoint from Swagger: /api/User/{id}
    const response = await api.get(`/User/${id}`);
    return response.data;
  },
  
  create: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    // This endpoint wasn't specifically shown in the Swagger UI image,
    // but we'll use the standard RESTful convention
    const response = await api.post('/User', userData);
    return response.data;
  },
  
  update: async (id: string, userData: Partial<User>): Promise<User> => {
    // Using the correct endpoint from Swagger: /api/User/{id}
    const response = await api.put(`/User/${id}`, userData);
    return response.data;
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    // Using the correct endpoint from Swagger: /api/User/{id}
    await api.delete(`/User/${id}`);
    return { success: true };
  }
};

export default userService;
