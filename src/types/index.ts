
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  phone?: string;
  address?: string;
}

export interface Customer {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  visits: number;
  status: 'active' | 'inactive';
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: 'popular' | 'starter' | 'main' | 'dessert';
  available: boolean;
}

export interface Reservation {
  id: string;
  customerId: string;
  dateTime: string;
  guests: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}
