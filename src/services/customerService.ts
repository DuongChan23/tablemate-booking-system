
import api from './api';
import { Customer } from '@/types';

// Mock customers data for demonstration
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    address: '123 Main St, City',
    visits: 8,
    lastVisit: '2025-03-15T18:30:00',
    totalSpent: 450.75,
    status: 'active',
    createdAt: '2025-01-01T00:00:00'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    address: '456 Oak Dr, Town',
    visits: 12,
    lastVisit: '2025-03-28T20:15:00',
    totalSpent: 725.50,
    status: 'active',
    createdAt: '2025-01-02T00:00:00'
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
  
  create: async (customerData: Omit<Customer, 'id' | 'createdAt' | 'visits' | 'totalSpent'>) => {
    // This would be an actual API call in production
    const newCustomer = {
      ...customerData,
      id: `cust${Math.floor(Math.random() * 1000)}`,
      visits: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString()
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
