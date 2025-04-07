
import api from './api';
import { Reservation } from '@/types';

// Mock reservations for demonstration
const mockReservations: Reservation[] = [
  {
    id: '1',
    customerId: 'cust1',
    dateTime: '2025-04-10T18:30:00',
    guests: 4,
    specialRequests: 'Window seat preferred',
    status: 'confirmed',
    createdAt: '2025-04-01T10:15:00'
  },
  {
    id: '2',
    customerId: 'cust2',
    dateTime: '2025-04-10T19:00:00',
    guests: 2,
    specialRequests: 'Anniversary dinner',
    status: 'pending',
    createdAt: '2025-04-02T09:20:00'
  },
  // ... more reservations would be here
];

// Mock customer data for demonstration
const mockCustomers: Record<string, { name: string, phone: string }> = {
  'cust1': { name: 'John Doe', phone: '555-123-4567' },
  'cust2': { name: 'Jane Smith', phone: '555-987-6543' },
  'cust3': { name: 'Robert Johnson', phone: '555-555-5555' },
  'cust4': { name: 'Emily Williams', phone: '555-222-3333' },
  'cust5': { name: 'Michael Brown', phone: '555-777-8888' }
};

const reservationService = {
  getAll: async () => {
    // This would be an actual API call in production
    return mockReservations;
  },
  
  getById: async (id: string) => {
    return mockReservations.find(reservation => reservation.id === id);
  },
  
  create: async (reservationData: Omit<Reservation, 'id' | 'createdAt'>) => {
    // This would be an actual API call in production
    const newReservation = {
      ...reservationData,
      id: `res${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    return newReservation;
  },
  
  update: async (id: string, reservationData: Partial<Reservation>) => {
    // This would be an actual API call in production
    const reservation = mockReservations.find(r => r.id === id);
    if (reservation) {
      return { ...reservation, ...reservationData };
    }
    throw new Error('Reservation not found');
  },
  
  delete: async (id: string) => {
    // This would be an actual API call in production
    return { success: true };
  },
  
  getCustomerInfo: async (customerId: string) => {
    return mockCustomers[customerId] || { name: 'Unknown', phone: 'N/A' };
  }
};

export default reservationService;
