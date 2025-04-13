
import api from './api';
import { User } from '@/types';

const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/user');
    return response.data;
  },
  
  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/user/${id}`);
    return response.data;
  },
  
  create: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const response = await api.post('/user', userData);
    return response.data;
  },
  
  update: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/user/${id}`, userData);
    return response.data;
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    await api.delete(`/user/${id}`);
    return { success: true };
  }
};

export default userService;
