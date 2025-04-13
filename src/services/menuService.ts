
import api from './api';
import { MenuItem } from '@/types';

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
  getAll: async (): Promise<MenuItem[]> => {
    // Using the correct endpoint from Swagger: /api/Menu
    const response = await api.get('/Menu');
    return response.data;
  },
  
  getById: async (id: string): Promise<MenuItem> => {
    // Using the correct endpoint from Swagger: /api/Menu/{id}
    const response = await api.get(`/Menu/${id}`);
    return response.data;
  },
  
  create: async (menuData: Omit<MenuItem, 'id'>, imageFile?: File): Promise<MenuItem> => {
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
    
    // Using the correct endpoint from Swagger: /api/Menu
    const response = await api.post('/Menu', menuData);
    return response.data;
  },
  
  update: async (id: string, menuData: Partial<MenuItem>, imageFile?: File): Promise<MenuItem> => {
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
    
    // Using the correct endpoint from Swagger: /api/Menu/{id}
    const response = await api.put(`/Menu/${id}`, menuData);
    return response.data;
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    // Using the correct endpoint from Swagger: /api/Menu/{id}
    await api.delete(`/Menu/${id}`);
    return { success: true };
  }
};

export default menuService;
