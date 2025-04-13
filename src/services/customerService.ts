
import api from './api';
import { Customer } from '@/types';

const customerService = {
  getAll: async (): Promise<Customer[]> => {
    // Using the correct endpoint from Swagger: /api/Customers
    const response = await api.get('/Customers');
    return response.data;
  },
  
  getById: async (id: string): Promise<Customer> => {
    // Using the correct endpoint from Swagger: /api/Customers/{id}
    const response = await api.get(`/Customers/${id}`);
    return response.data;
  },
  
  getByEmail: async (email: string): Promise<Customer | undefined> => {
    // No specific endpoint exists for getByEmail, we'll filter from all customers
    try {
      const allCustomers = await customerService.getAll();
      return allCustomers.find(customer => customer.email === email);
    } catch (error) {
      console.error('Error getting customer by email:', error);
      throw error;
    }
  },
  
  getByUserId: async (userId: string): Promise<Customer[]> => {
    // No specific endpoint exists for getByUserId, we'll filter from all customers
    try {
      const allCustomers = await customerService.getAll();
      return allCustomers.filter(customer => customer.userId === userId);
    } catch (error) {
      console.error('Error getting customers by userId:', error);
      throw error;
    }
  },
  
  create: async (customerData: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
    // Using the correct endpoint from Swagger: /api/Customers
    const response = await api.post('/Customers', customerData);
    return response.data;
  },
  
  update: async (id: string, customerData: Partial<Customer>): Promise<Customer> => {
    // Using the correct endpoint from Swagger: /api/Customers/{id}
    const response = await api.put(`/Customers/${id}`, customerData);
    return response.data;
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    // Using the correct endpoint from Swagger: /api/Customers/{id}
    await api.delete(`/Customers/${id}`);
    return { success: true };
  }
};

export default customerService;
