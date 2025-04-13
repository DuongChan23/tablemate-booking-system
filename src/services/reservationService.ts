
import api from './api';
import { Reservation, ReservationMenuItem } from '@/types';
import menuService from './menuService';
import customerService from './customerService';

// Mock reservation menu items for demonstration
const mockReservationMenuItems: ReservationMenuItem[] = [
  {
    reservationId: '1',
    menuItemId: '1',
    quantity: 2
  },
  {
    reservationId: '1',
    menuItemId: '3',
    quantity: 1
  },
  {
    reservationId: '2',
    menuItemId: '2',
    quantity: 2
  }
];

// Mock reservations for demonstration
const mockReservations: Reservation[] = [
  {
    id: '1',
    userId: 'user1',
    customerId: 'cust1',
    reservationDate: '2025-04-10T18:30:00',
    numberOfGuests: 4,
    tableType: 'window',
    specialRequests: 'Window seat preferred',
    status: 'confirmed',
    createdAt: '2025-04-01T10:15:00',
    rowVersion: '0x00000000000007D1'
  },
  {
    id: '2',
    userId: 'user1',
    customerId: 'cust2',
    reservationDate: '2025-04-10T19:00:00',
    numberOfGuests: 2,
    tableType: 'regular',
    specialRequests: 'Anniversary dinner',
    status: 'pending',
    createdAt: '2025-04-02T09:20:00',
    rowVersion: '0x00000000000007D2'
  },
  {
    id: '3',
    userId: 'user2',
    customerId: 'cust3',
    reservationDate: '2025-04-11T20:15:00',
    numberOfGuests: 6,
    tableType: 'large',
    status: 'confirmed',
    createdAt: '2025-04-02T14:30:00',
    rowVersion: '0x00000000000007D3'
  },
  {
    id: '4',
    userId: 'user2',
    customerId: 'cust4',
    reservationDate: '2025-04-09T17:45:00',
    numberOfGuests: 3,
    tableType: 'regular',
    specialRequests: 'High chair needed',
    status: 'completed',
    createdAt: '2025-04-01T11:05:00',
    rowVersion: '0x00000000000007D4'
  },
  {
    id: '5',
    userId: 'user1',
    customerId: 'cust5',
    reservationDate: '2025-04-12T21:00:00',
    numberOfGuests: 8,
    tableType: 'private',
    specialRequests: 'Business dinner, private room if possible',
    status: 'cancelled',
    createdAt: '2025-04-03T16:45:00',
    rowVersion: '0x00000000000007D5'
  }
];

const reservationService = {
  getAll: async () => {
    // This would be an API call to GET /api/reservation for admins
    // or GET /api/reservation/my-customers-reservations for users
    return mockReservations;
  },
  
  getById: async (id: string) => {
    const reservation = mockReservations.find(res => res.id === id);
    if (reservation) {
      const menuItems = mockReservationMenuItems.filter(item => item.reservationId === id);
      return { ...reservation, menuItems };
    }
    return null;
  },
  
  getUserReservations: async (userId: string) => {
    // This would be an API call to GET /api/reservation/my-customers-reservations
    return mockReservations.filter(res => res.userId === userId);
  },
  
  create: async (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'rowVersion'>) => {
    // This would be an API call to POST /api/reservation
    // In real app would include validation of customer ownership, menu items existence
    const newReservation = {
      ...reservationData,
      id: `res${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      rowVersion: `0x00000000000${Math.floor(Math.random() * 10000)}`
    };
    
    // In a real app, this would add to the database
    mockReservations.push(newReservation);
    
    return newReservation;
  },
  
  update: async (id: string, reservationData: Partial<Reservation>) => {
    // This would be an API call to PUT /api/reservation/{id}
    // In real app would check ownership and handle concurrency with rowVersion
    const reservationIndex = mockReservations.findIndex(r => r.id === id);
    if (reservationIndex >= 0) {
      // Update rowVersion when updating the reservation
      const newRowVersion = `0x00000000000${Math.floor(Math.random() * 10000)}`;
      
      mockReservations[reservationIndex] = { 
        ...mockReservations[reservationIndex], 
        ...reservationData,
        rowVersion: newRowVersion
      };
      return mockReservations[reservationIndex];
    }
    throw new Error('Reservation not found');
  },
  
  delete: async (id: string) => {
    // This would be an API call to DELETE /api/reservation/{id}
    // In real app would check ownership
    const reservationIndex = mockReservations.findIndex(r => r.id === id);
    if (reservationIndex >= 0) {
      mockReservations.splice(reservationIndex, 1);
      
      // Also delete any associated menu items
      const menuItemsToKeep = mockReservationMenuItems.filter(
        item => item.reservationId !== id
      );
      mockReservationMenuItems.length = 0;
      mockReservationMenuItems.push(...menuItemsToKeep);
    }
    return { success: true };
  },
  
  getCustomerInfo: async (customerId: string) => {
    const customer = await customerService.getById(customerId);
    return customer || { name: 'Unknown', phone: 'N/A' };
  },
  
  addMenuItemToReservation: async (reservationId: string, menuItemId: string, quantity: number) => {
    // This would be an actual API call in production
    const existingItem = mockReservationMenuItems.find(
      item => item.reservationId === reservationId && item.menuItemId === menuItemId
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
      return existingItem;
    } else {
      const newItem = {
        reservationId,
        menuItemId,
        quantity
      };
      mockReservationMenuItems.push(newItem);
      return newItem;
    }
  },
  
  getReservationMenuItems: async (reservationId: string) => {
    const items = mockReservationMenuItems.filter(item => item.reservationId === reservationId);
    
    // Fetch menu item details for each reservation menu item
    const detailedItems = await Promise.all(items.map(async (item) => {
      const menuItem = await menuService.getById(item.menuItemId);
      return {
        ...item,
        menuItem
      };
    }));
    
    return detailedItems;
  }
};

export default reservationService;
