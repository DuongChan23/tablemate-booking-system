
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
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    phone: '555-555-5555',
    address: '789 Pine St, Village',
    visits: 3,
    lastVisit: '2025-03-10T19:00:00',
    totalSpent: 175.25,
    status: 'active',
    createdAt: '2025-01-15T00:00:00'
  },
  {
    id: '4',
    name: 'Emily Williams',
    email: 'emily.williams@example.com',
    phone: '555-222-3333',
    address: '321 Cedar Rd, Suburb',
    visits: 1,
    lastVisit: '2025-02-20T18:00:00',
    totalSpent: 87.50,
    status: 'inactive',
    createdAt: '2025-02-18T00:00:00'
  },
  {
    id: '5',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '555-777-8888',
    address: '654 Maple Ave, Downtown',
    visits: 6,
    lastVisit: '2025-03-25T19:30:00',
    totalSpent: 320.00,
    status: 'active',
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
  
  recordVisit: async (id: string, amount: number) => {
    const customer = mockCustomers.find(c => c.id === id);
    if (customer) {
      const updatedCustomer = {
        ...customer,
        visits: customer.visits + 1,
        lastVisit: new Date().toISOString(),
        totalSpent: customer.totalSpent + amount
      };
      return updatedCustomer;
    }
    throw new Error('Customer not found');
  },
  
  delete: async (id: string) => {
    // This would be an actual API call in production
    return { success: true };
  }
};

export default customerService;
