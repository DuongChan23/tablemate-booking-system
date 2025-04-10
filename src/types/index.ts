
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  address?: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  visits: number;
  lastVisit?: string;
  totalSpent: number;
  status: 'active' | 'inactive';
  createdAt: string;
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
