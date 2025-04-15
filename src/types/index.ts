
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: string;
  phone?: string;
}

export interface Customer {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  status?: 'active' | 'inactive';
  address?: string;
  visits?: number;
  totalSpent?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  isActive?: boolean;
}

export interface Reservation {
  id: string;
  userId: string;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  reservationDate: string;
  numberOfGuests: number;
  tableType: string;
  specialRequests?: string;
  createdAt: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
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
