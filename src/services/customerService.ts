
import api from './api';
import { Customer } from '@/types';

const customerService = {
  getAll: async (): Promise<Customer[]> => {
    // Using the correct endpoint from the image: /api/Customer
    const response = await api.get('/Customer');
    return response.data;
  },
  
  getById: async (id: string): Promise<Customer> => {
    // Using the correct endpoint from the image: /api/Customer/{id}
    const response = await api.get(`/Customer/${id}`);
    return response.data;
  },
  
  getByEmail: async (email: string): Promise<Customer | undefined> => {
    // Using the correct endpoint from the image: /api/Customer/email/{email}
    try {
      const response = await api.get(`/Customer/email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error getting customer by email:', error);
      return undefined;
    }
  },
  
  getByUserId: async (userId: string): Promise<Customer[]> => {
    // Using the correct endpoint from the image: /api/Customer/user/{userId}
    try {
      const response = await api.get(`/Customer/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting customers by userId:', error);
      throw error;
    }
  },
  
  create: async (customerData: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
    // Using the correct endpoint from the image: /api/Customer
    const response = await api.post('/Customer', customerData);
    return response.data;
  },
  
  update: async (id: string, customerData: Partial<Customer>): Promise<Customer> => {
    // Using the correct endpoint from the image: /api/Customer/{id}
    const response = await api.put(`/Customer/${id}`, customerData);
    return response.data;
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    // Using the correct endpoint from the image: /api/Customer/{id}
    await api.delete(`/Customer/${id}`);
    return { success: true };
  }
};

export default customerService;
