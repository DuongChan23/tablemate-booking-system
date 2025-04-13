
import api from './api';
import { Reservation, ReservationMenuItem } from '@/types';
import menuService from './menuService';
import customerService from './customerService';

const reservationService = {
  getAll: async (): Promise<Reservation[]> => {
    // This endpoint is for admins
    const response = await api.get('/reservation');
    return response.data;
  },
  
  getById: async (id: string): Promise<Reservation> => {
    const response = await api.get(`/reservation/${id}`);
    const reservation = response.data;
    
    // Get the menu items for this reservation if needed
    const menuItems = await reservationService.getReservationMenuItems(id);
    return {
      ...reservation,
      menuItems
    };
  },
  
  getUserReservations: async (userId: string): Promise<Reservation[]> => {
    // This endpoint gets reservations for the current user
    const response = await api.get('/reservation/my-reservations');
    return response.data;
  },
  
  create: async (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'rowVersion'>): Promise<Reservation> => {
    const response = await api.post('/reservation', reservationData);
    return response.data;
  },
  
  update: async (id: string, reservationData: Partial<Reservation>): Promise<Reservation> => {
    const response = await api.put(`/reservation/${id}`, reservationData);
    return response.data;
  },
  
  delete: async (id: string): Promise<{ success: boolean }> => {
    await api.delete(`/reservation/${id}`);
    return { success: true };
  },
  
  getCustomerInfo: async (customerId: string) => {
    const customer = await customerService.getById(customerId);
    return customer || { name: 'Unknown', phone: 'N/A' };
  },
  
  addMenuItemToReservation: async (reservationId: string, menuItemId: string, quantity: number): Promise<ReservationMenuItem> => {
    // This would need to be implemented if there's an endpoint for it
    // For now, we'll add it as part of the update operation
    const reservation = await reservationService.getById(reservationId);
    
    if (!reservation.menuItems) {
      reservation.menuItems = [];
    }
    
    const existingItem = reservation.menuItems.find(
      item => item.menuItemId === menuItemId && item.reservationId === reservationId
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
      await reservationService.update(reservationId, { menuItems: reservation.menuItems });
      return existingItem;
    } else {
      const newItem = {
        reservationId,
        menuItemId,
        quantity
      };
      
      reservation.menuItems.push(newItem);
      await reservationService.update(reservationId, { menuItems: reservation.menuItems });
      return newItem;
    }
  },
  
  getReservationMenuItems: async (reservationId: string) => {
    // If there's a specific endpoint for this, we'd use it
    // For now, we're assuming the menuItems are included with the reservation
    const reservation = await api.get(`/reservation/${reservationId}`);
    let items = reservation.data.menuItems || [];
    
    // Fetch menu item details for each reservation menu item if needed
    if (items.length > 0 && !items[0].menuItem) {
      const detailedItems = await Promise.all(items.map(async (item: ReservationMenuItem) => {
        const menuItem = await menuService.getById(item.menuItemId);
        return {
          ...item,
          menuItem
        };
      }));
      
      return detailedItems;
    }
    
    return items;
  }
};

export default reservationService;
