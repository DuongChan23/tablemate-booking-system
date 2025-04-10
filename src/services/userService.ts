
import api from './api';
import { User } from '@/types';

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@tablemate.com',
    passwordHash: 'hashed_password_here',
    phone: '555-123-4567',
    address: '123 Admin St, City',
    role: 'admin',
    createdAt: '2025-01-01T00:00:00'
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    passwordHash: 'hashed_password_here',
    phone: '555-987-6543',
    address: '456 User Ave, Town',
    role: 'user',
    createdAt: '2025-01-02T00:00:00'
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
  
  create: async (userData: Omit<User, 'id' | 'createdAt'>) => {
    // This would be an actual API call in production
    const newUser = {
      ...userData,
      id: `user${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
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
