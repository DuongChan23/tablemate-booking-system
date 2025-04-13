
import api from './api';
import { Reservation, ReservationMenuItem } from '@/types';

const reservationService = {
  getAll: async (): Promise<Reservation[]> => {
    // Using the correct endpoint from the image: /api/Reservation
    const response = await api.get('/Reservation');
    return response.data;
  },
  
  getById: async (id: string): Promise<Reservation> => {
    // Using the correct endpoint from the image: /api/Reservation/{id}
    const response = await api.get(`/Reservation/${id}`);
    return response.data;
  },
  
  getUserReservations: async (userId: string): Promise<Reservation[]> => {
    // Using the correct endpoint from the image: /api/Reservation/user/{userId}
    const response = await api.get(`/Reservation/user/${userId}`);
    return response.data;
  },
  
  getCustomerReservations: async (customerId: string): Promise<Reservation[]> => {
    // Using the correct endpoint from the image: /api/Reservation/customer/{customerId}
    const response = await api.get(`/Reservation/customer/${customerId}`);
    return response.data;
  },
  
  create: async (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'rowVersion'>): Promise<Reservation> => {
    // Using the correct endpoint from the image: /api/Reservation
    const response = await api.post('/Reservation', reservationData);
    return response.data;
  },
  
  update: async (id: string, reservationData: Partial<Reservation>): Promise<Reservation> => {
    // Using the correct endpoint from the image: /api/Reservation/{id}
    const response = await api.put(`/Reservation/${id}`, reservationData);
    return response.data;
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    // Using the correct endpoint from the image: /api/Reservation/{id}
    await api.delete(`/Reservation/${id}`);
    return { success: true };
  },
  
  // For handling menu items associated with reservations
  addMenuItemToReservation: async (reservationId: string, menuItemId: string, quantity: number): Promise<ReservationMenuItem> => {
    // Using the correct endpoint from the image: /api/Reservation/{reservationId}/menu-item/{menuItemId}
    const response = await api.post(`/Reservation/${reservationId}/menu-item/${menuItemId}`, { quantity });
    return response.data;
  },
  
  getReservationMenuItems: async (reservationId: string): Promise<ReservationMenuItem[]> => {
    // Using the correct endpoint from the image: /api/Reservation/{reservationId}/menu-items
    const response = await api.get(`/Reservation/${reservationId}/menu-items`);
    return response.data;
  }
};

export default reservationService;
