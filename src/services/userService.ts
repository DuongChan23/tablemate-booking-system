
import api from './api';
import { User } from '@/types';

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@tablemate.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    phone: '555-123-4567',
    address: '123 Admin St, City'
  },
  {
    id: '2',
    email: 'user@example.com',
    firstName: 'Regular',
    lastName: 'User',
    role: 'user',
    phone: '555-987-6543',
    address: '456 User Ave, Town'
  }
];

const userService = {
  getAll: async () => {
    // This would be an actual API call in production
    return mockUsers;
  },
  
  getById: async (id: string) => {
    return mockUsers.find(user => user.id === id);
  },
  
  create: async (userData: Omit<User, 'id'>) => {
    // This would be an actual API call in production
    const newUser = {
      ...userData,
      id: `user${Math.floor(Math.random() * 1000)}`,
    };
    return newUser;
  },
  
  update: async (id: string, userData: Partial<User>) => {
    // This would be an actual API call in production
    const user = mockUsers.find(u => u.id === id);
    if (user) {
      return { ...user, ...userData };
    }
    throw new Error('User not found');
  },
  
  delete: async (id: string) => {
    // This would be an actual API call in production
    return { success: true };
  }
};

export default userService;
