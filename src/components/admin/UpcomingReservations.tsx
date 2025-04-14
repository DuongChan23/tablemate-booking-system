
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import reservationService from '@/services/reservationService';
import customerService from '@/services/customerService';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';

const UpcomingReservations = () => {
  // Fetch reservations
  const { data: reservations, isLoading } = useQuery({
    queryKey: ['reservations'],
    queryFn: reservationService.getAll,
  });

  // Fetch customers for reservation names
  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: customerService.getAll,
  });

  // Get customer name by ID
  const getCustomerName = (customerId: string) => {
    const customer = customers?.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  // Get upcoming reservations (today and future, confirmed status)
  const upcomingReservations = reservations
    ? [...reservations]
        .filter(reservation => {
          const reservationDate = new Date(reservation.reservationDate);
          const now = new Date();
          return (
            (reservation.status === 'confirmed' || reservation.status === 'pending') && 
            reservationDate >= now
          );
        })
        .sort((a, b) => 
          new Date(a.reservationDate).getTime() - new Date(b.reservationDate).getTime()
        )
        .slice(0, 4)
    : [];

  // Format date display
  const formatDateDisplay = (date: string) => {
    const reservationDate = parseISO(date);
    if (isToday(reservationDate)) return 'Today';
    if (isTomorrow(reservationDate)) return 'Tomorrow';
    return format(reservationDate, 'MMM d');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Reservations</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between items-start border-b pb-4">
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
                </div>
                <div className="text-right space-y-2">
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-100 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : upcomingReservations.length === 0 ? (
          <p className="text-center text-muted-foreground">No upcoming reservations found.</p>
        ) : (
          <div className="space-y-4">
            {upcomingReservations.map((reservation, index) => (
              <div 
                key={reservation.id} 
                className={`flex justify-between items-start ${
                  index < upcomingReservations.length - 1 ? 'border-b pb-4' : ''
                }`}
              >
                <div>
                  <h3 className="font-medium">{getCustomerName(reservation.customerId)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {reservation.numberOfGuests} guests • {reservation.tableType}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatDateDisplay(reservation.reservationDate)}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(reservation.reservationDate), 'h:mm a')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingReservations;
