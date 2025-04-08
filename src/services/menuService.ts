
import api from './api';
import { MenuItem } from '@/types';

// Mock menu items for demonstration
const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Lobster Bisque',
    description: 'Smooth, creamy soup made from lobster stock, aromatic vegetables, and a touch of brandy.',
    price: 18,
    image: 'https://images.unsplash.com/photo-1606255557509-6ba258c2b5e2',
    category: 'starter',
    isActive: true
  },
  {
    id: '2',
    name: 'Beef Wellington',
    description: 'Tender fillet of beef, wrapped in layers of mushroom duxelles, ham, and flaky puff pastry.',
    price: 42,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
    category: 'main',
    isActive: true
  },
  {
    id: '3',
    name: 'Chocolate Soufflé',
    description: 'Airy and light chocolate dessert served with vanilla ice cream.',
    price: 14,
    image: 'https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2',
    category: 'dessert',
    isActive: true
  },
  // ... more menu items would be here
];

const menuService = {
  getAll: async () => {
    // This would be an actual API call in production
    return mockMenuItems;
  },
  
  getById: async (id: string) => {
    return mockMenuItems.find(item => item.id === id);
  },
  
  create: async (menuData: Omit<MenuItem, 'id'>) => {
    // This would be an actual API call in production
    const newItem = {
      ...menuData,
      id: `item${Math.floor(Math.random() * 1000)}`,
    };
    return newItem;
  },
  
  update: async (id: string, menuData: Partial<MenuItem>) => {
    // This would be an actual API call in production
    const item = mockMenuItems.find(i => i.id === id);
    if (item) {
      return { ...item, ...menuData };
    }
    throw new Error('Menu item not found');
  },
  
  delete: async (id: string) => {
    // This would be an actual API call in production
    return { success: true };
  }
};

export default menuService;
