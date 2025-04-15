
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
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
