
import api from './api';
import { Reservation, ReservationMenuItem } from '@/types';

const reservationService = {
  getAll: async (): Promise<Reservation[]> => {
    try {
      const response = await api.get('/Reservations');
      return response.data;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      return [];
    }
  },
  
  getById: async (id: string): Promise<Reservation | null> => {
    try {
      const response = await api.get(`/Reservations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reservation ${id}:`, error);
      return null;
    }
  },
  
  getUserReservations: async (userId: string): Promise<Reservation[]> => {
    try {
      const response = await api.get(`/Reservations/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user reservations for ${userId}:`, error);
      return [];
    }
  },
  
  getCustomerReservations: async (customerId: string): Promise<Reservation[]> => {
    try {
      const response = await api.get(`/Reservations/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer reservations for ${customerId}:`, error);
      return [];
    }
  },
  
  create: async (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'rowVersion'>): Promise<Reservation | null> => {
    try {
      const response = await api.post('/Reservations', reservationData);
      return response.data;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },
  
  update: async (id: string, reservationData: Partial<Reservation>): Promise<Reservation | null> => {
    try {
      const response = await api.put(`/Reservations/${id}`, reservationData);
      return response.data;
    } catch (error) {
      console.error(`Error updating reservation ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    try {
      await api.delete(`/Reservations/${id}`);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting reservation ${id}:`, error);
      return { success: false };
    }
  },
  
  // For handling menu items associated with reservations
  addMenuItemToReservation: async (reservationId: string, menuItemId: string, quantity: number): Promise<ReservationMenuItem | null> => {
    try {
      const response = await api.post(`/Reservations/${reservationId}/menu-item/${menuItemId}`, { quantity });
      return response.data;
    } catch (error) {
      console.error(`Error adding menu item to reservation ${reservationId}:`, error);
      return null;
    }
  },
  
  getReservationMenuItems: async (reservationId: string): Promise<ReservationMenuItem[]> => {
    try {
      const response = await api.get(`/Reservations/${reservationId}/menu-items`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching menu items for reservation ${reservationId}:`, error);
      return [];
    }
  }
};

export default reservationService;
