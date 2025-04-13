
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  createdAt: string;
  phone?: string; // Added phone property for User
}

export interface Customer {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  status: 'active' | 'inactive';
  address?: string; // Added address for Customer
  visits?: number; // Added visits tracking
  totalSpent?: number; // Added totalSpent tracking
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  isActive: boolean;
}

export interface Reservation {
  id: string;
  userId: string;
  customerId: string;
  reservationDate: string;
  numberOfGuests: number;
  tableType: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  rowVersion?: string;
  menuItems?: ReservationMenuItem[];
}

export interface ReservationMenuItem {
  reservationId: string;
  menuItemId: string;
  quantity: number;
}

export interface EFMigrationsHistory {
  migrationId: string;
  productVersion: string;
}
