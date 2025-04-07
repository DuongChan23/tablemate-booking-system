
import api from './api';
import { Customer } from '@/types';

// Mock customers data for demonstration
const mockCustomers: Customer[] = [
  {
    id: '1',
    userId: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    address: '123 Main St, City',
    visits: 8,
    status: 'active'
  },
  {
    id: '2',
    userId: 'user2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    address: '456 Oak Dr, Town',
    visits: 12,
    status: 'active'
  },
  // ... more customers would be here
];

const customerService = {
  getAll: async () => {
    // This would be an actual API call in production
    return mockCustomers;
  },
  
  getById: async (id: string) => {
    return mockCustomers.find(customer => customer.id === id);
  },
  
  create: async (customerData: Omit<Customer, 'id'>) => {
    // This would be an actual API call in production
    const newCustomer = {
      ...customerData,
      id: `cust${Math.floor(Math.random() * 1000)}`,
    };
    return newCustomer;
  },
  
  update: async (id: string, customerData: Partial<Customer>) => {
    // This would be an actual API call in production
    const customer = mockCustomers.find(c => c.id === id);
    if (customer) {
      return { ...customer, ...customerData };
    }
    throw new Error('Customer not found');
  },
  
  delete: async (id: string) => {
    // This would be an actual API call in production
    return { success: true };
  }
};

export default customerService;
