import React from 'react';
import { Calendar, Clock, Users, UtensilsCrossed, UserCog } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import reservationService from '@/services/reservationService';
import customerService from '@/services/customerService';
import userService from '@/services/userService';
import menuService from '@/services/menuService';
import { format } from 'date-fns';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, isLoading }) => (
  <Card>
    <CardContent className="p-6 flex flex-row items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        {isLoading ? (
          <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <p className="text-3xl font-bold">{value}</p>
        )}
      </div>
      {icon}
    </CardContent>
  </Card>
);

const DashboardStats = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Fetch reservations
  const {
    data: reservations,
    isLoading: isLoadingReservations
  } = useQuery({
    queryKey: ['reservations'],
    queryFn: reservationService.getAll,
  });

  // Fetch customers
  const {
    data: customers,
    isLoading: isLoadingCustomers
  } = useQuery({
    queryKey: ['customers'],
    queryFn: customerService.getAll,
  });

  // Fetch users
  const {
    data: users,
    isLoading: isLoadingUsers
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  });

  // Fetch menu items
  const {
    data: menuItems,
    isLoading: isLoadingMenuItems
  } = useQuery({
    queryKey: ['menuItems'],
    queryFn: menuService.getAll,
  });

  // Calculate today's reservations
  const todayReservations = reservations?.filter(reservation => {
    const reservationDate = new Date(reservation.reservationDate);
    reservationDate.setHours(0, 0, 0, 0);
    return reservationDate.getTime() === today.getTime();
  })?.length || 0;
  
  // Calculate pending requests
  const pendingRequests = reservations?.filter(
    reservation => reservation.status === 'pending'
  )?.length || 0;

  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard 
        title="Today's Reservations" 
        value={isLoadingReservations ? '...' : todayReservations} 
        icon={<Calendar className="h-8 w-8 text-tablemate-burgundy opacity-80" />}
        isLoading={isLoadingReservations}
      />
      
      <StatCard 
        title="Total Customers" 
        value={isLoadingCustomers ? '...' : customers?.length || 0} 
        icon={<Users className="h-8 w-8 text-tablemate-burgundy opacity-80" />}
        isLoading={isLoadingCustomers}
      />
      
      <StatCard 
        title="Total Users" 
        value={isLoadingUsers ? '...' : users?.length || 0} 
        icon={<UserCog className="h-8 w-8 text-tablemate-burgundy opacity-80" />}
        isLoading={isLoadingUsers}
      />
      
      <StatCard 
        title="Menu Items" 
        value={isLoadingMenuItems ? '...' : menuItems?.length || 0} 
        icon={<UtensilsCrossed className="h-8 w-8 text-tablemate-burgundy opacity-80" />}
        isLoading={isLoadingMenuItems}
      />
      
      <StatCard 
        title="Pending Requests" 
        value={isLoadingReservations ? '...' : pendingRequests} 
        icon={<Clock className="h-8 w-8 text-tablemate-burgundy opacity-80" />}
        isLoading={isLoadingReservations}
      />
    </div>
  );
};

export default DashboardStats;
