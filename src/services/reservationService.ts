
import api from './api';
import { Reservation, ReservationMenuItem } from '@/types';

const reservationService = {
  getAll: async (): Promise<Reservation[]> => {
    // Using the correct endpoint from Swagger: /api/Reservation
    const response = await api.get('/Reservation');
    return response.data;
  },
  
  getById: async (id: string): Promise<Reservation> => {
    // Using the correct endpoint from Swagger: /api/Reservation/{id}
    const response = await api.get(`/Reservation/${id}`);
    return response.data;
  },
  
  getUserReservations: async (userId: string): Promise<Reservation[]> => {
    // Using the correct endpoint from Swagger: /api/Reservation/my-reservations
    const response = await api.get('/Reservation/my-reservations');
    return response.data;
  },
  
  getCustomerReservations: async (customerId: string): Promise<Reservation[]> => {
    // Using the correct endpoint from Swagger: /api/Reservation/customer/{customerId}
    const response = await api.get(`/Reservation/customer/${customerId}`);
    return response.data;
  },
  
  create: async (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'rowVersion'>): Promise<Reservation> => {
    // Using the correct endpoint from Swagger: /api/Reservation
    const response = await api.post('/Reservation', reservationData);
    return response.data;
  },
  
  update: async (id: string, reservationData: Partial<Reservation>): Promise<Reservation> => {
    // Using the correct endpoint from Swagger: /api/Reservation/{id}
    const response = await api.put(`/Reservation/${id}`, reservationData);
    return response.data;
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    // Using the correct endpoint from Swagger: /api/Reservation/{id}
    await api.delete(`/Reservation/${id}`);
    return { success: true };
  },
  
  // For handling menu items associated with reservations
  addMenuItemToReservation: async (reservationId: string, menuItemId: string, quantity: number): Promise<ReservationMenuItem> => {
    // This is a bit complex as we don't have a direct endpoint for this operation
    // We'll need to get the reservation, add the menu item, and update the reservation
    const reservation = await reservationService.getById(reservationId);
    
    if (!reservation.menuItems) {
      reservation.menuItems = [];
    }
    
    // Check if this menu item already exists in the reservation
    const existingMenuItem = reservation.menuItems.find(
      item => item.menuItemId === menuItemId && item.reservationId === reservationId
    );
    
    if (existingMenuItem) {
      // Update quantity if it already exists
      existingMenuItem.quantity += quantity;
      await reservationService.update(reservationId, { menuItems: reservation.menuItems });
      return existingMenuItem;
    } else {
      // Add new menu item if it doesn't exist
      const newMenuItem = {
        reservationId,
        menuItemId,
        quantity
      };
      
      reservation.menuItems.push(newMenuItem);
      await reservationService.update(reservationId, { menuItems: reservation.menuItems });
      return newMenuItem;
    }
  },
  
  getReservationMenuItems: async (reservationId: string): Promise<ReservationMenuItem[]> => {
    // This information should be included in the reservation response from getById
    const reservation = await reservationService.getById(reservationId);
    return reservation.menuItems || [];
  }
};

export default reservationService;
