
import api from './api';
import { Customer } from '@/types';

// Mock customers data for demonstration
const mockCustomers: Customer[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    createdAt: '2025-01-01T00:00:00'
  },
  {
    id: '2',
    userId: 'user1',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    createdAt: '2025-01-02T00:00:00'
  },
  {
    id: '3',
    userId: 'user2',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    phone: '555-555-5555',
    createdAt: '2025-01-15T00:00:00'
  },
  {
    id: '4',
    userId: 'user2',
    name: 'Emily Williams',
    email: 'emily.williams@example.com',
    phone: '555-222-3333',
    createdAt: '2025-02-18T00:00:00'
  },
  {
    id: '5',
    userId: 'user1',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '555-777-8888',
    createdAt: '2025-01-10T00:00:00'
  }
];

const customerService = {
  getAll: async () => {
    // This would be an actual API call in production
    return mockCustomers;
  },
  
  getById: async (id: string) => {
    return mockCustomers.find(customer => customer.id === id);
  },
  
  getByEmail: async (email: string) => {
    return mockCustomers.find(customer => customer.email === email);
  },
  
  getByUserId: async (userId: string) => {
    return mockCustomers.filter(customer => customer.userId === userId);
  },
  
  create: async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    // This would be an actual API call in production
    const newCustomer = {
      ...customerData,
      id: `cust${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    
    // In a real app this would add to the database
    mockCustomers.push(newCustomer);
    
    return newCustomer;
  },
  
  update: async (id: string, customerData: Partial<Customer>) => {
    // This would be an actual API call in production
    const customerIndex = mockCustomers.findIndex(c => c.id === id);
    if (customerIndex >= 0) {
      mockCustomers[customerIndex] = { 
        ...mockCustomers[customerIndex], 
        ...customerData 
      };
      return mockCustomers[customerIndex];
    }
    throw new Error('Customer not found');
  },
  
  delete: async (id: string) => {
    // This would be an actual API call in production
    const customerIndex = mockCustomers.findIndex(c => c.id === id);
    if (customerIndex >= 0) {
      mockCustomers.splice(customerIndex, 1);
    }
    return { success: true };
  }
};

export default customerService;
