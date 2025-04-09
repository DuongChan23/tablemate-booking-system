
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

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const menuService = {
  getAll: async () => {
    // This would be an actual API call in production
    return mockMenuItems;
  },
  
  getById: async (id: string) => {
    return mockMenuItems.find(item => item.id === id);
  },
  
  create: async (menuData: Omit<MenuItem, 'id'>, imageFile?: File) => {
    // This would be an actual API call in production
    let imageUrl = menuData.image;
    
    // If an image file is provided, convert it to base64
    if (imageFile) {
      try {
        imageUrl = await fileToBase64(imageFile);
      } catch (error) {
        console.error("Error converting image file:", error);
      }
    }
    
    const newItemId = `item${Math.floor(Math.random() * 1000)}`;
    
    // Check if an item with this id already exists to prevent duplicates
    const idExists = mockMenuItems.some(item => item.id === newItemId);
    
    const newItem = {
      ...menuData,
      image: imageUrl,
      id: idExists ? `item${Math.floor(Math.random() * 1000000)}` : newItemId, // Ensure unique ID
    };
    
    // In a real app this would save to a database
    mockMenuItems.push(newItem);
    
    return newItem;
  },
  
  update: async (id: string, menuData: Partial<MenuItem>, imageFile?: File) => {
    // This would be an actual API call in production
    let imageUrl = menuData.image;
    
    // If an image file is provided, convert it to base64
    if (imageFile) {
      try {
        imageUrl = await fileToBase64(imageFile);
        menuData.image = imageUrl;
      } catch (error) {
        console.error("Error converting image file:", error);
      }
    }
    
    const itemIndex = mockMenuItems.findIndex(i => i.id === id);
    if (itemIndex >= 0) {
      mockMenuItems[itemIndex] = { ...mockMenuItems[itemIndex], ...menuData };
      return mockMenuItems[itemIndex];
    }
    throw new Error('Menu item not found');
  },
  
  delete: async (id: string) => {
    // This would be an actual API call in production
    const itemIndex = mockMenuItems.findIndex(i => i.id === id);
    if (itemIndex >= 0) {
      mockMenuItems.splice(itemIndex, 1);
    }
    return { success: true };
  }
};

export default menuService;
