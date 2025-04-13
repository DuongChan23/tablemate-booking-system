
import api from './api';
import { Customer } from '@/types';

const customerService = {
  getAll: async (): Promise<Customer[]> => {
    const response = await api.get('/customers');
    return response.data;
  },
  
  getById: async (id: string): Promise<Customer> => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },
  
  getByEmail: async (email: string): Promise<Customer> => {
    const allCustomers = await customerService.getAll();
    return allCustomers.find(customer => customer.email === email);
  },
  
  getByUserId: async (userId: string): Promise<Customer[]> => {
    // The API doesn't seem to have a direct endpoint for this,
    // so we'll filter from all customers
    const allCustomers = await customerService.getAll();
    return allCustomers.filter(customer => customer.userId === userId);
  },
  
  create: async (customerData: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },
  
  update: async (id: string, customerData: Partial<Customer>): Promise<Customer> => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    await api.delete(`/customers/${id}`);
    return { success: true };
  }
};

export default customerService;
