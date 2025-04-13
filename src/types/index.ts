
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Customer {
  id: string;
  userId: string; // Added userId field to match database diagram
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
  image?: string; // Keeping image as optional since it's not in DB schema but useful for UI
  category: string; // Keeping category for UI organization
  isActive: boolean; // Keeping this for filtering active menu items
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
  rowVersion?: string; // Added rowVersion as optional to match schema
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
