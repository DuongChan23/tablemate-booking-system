import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import reservationService from '@/services/reservationService';
import customerService from '@/services/customerService';
import { format, parseISO } from 'date-fns';

const RecentReservations = () => {
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

  // Sort reservations by creation date (most recent first)
  const sortedReservations = reservations
    ? [...reservations].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 5)
    : [];

  // Format the time difference
  const formatTimeDifference = (date: string) => {
    const now = new Date();
    const createdAt = new Date(date);
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Reservations</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                <div className="flex-grow space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-gray-100 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-20 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : sortedReservations.length === 0 ? (
          <p className="text-center text-muted-foreground">No recent reservations found.</p>
        ) : (
          <div className="space-y-4">
            {sortedReservations.map((item, index) => (
              <div key={item.id} className={`flex items-center ${index < sortedReservations.length - 1 ? 'border-b pb-4' : ''}`}>
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  item.status === 'confirmed' ? 'bg-green-500' : 
                  item.status === 'pending' ? 'bg-yellow-500' : 
                  item.status === 'completed' ? 'bg-blue-500' :
                  'bg-red-500'
                }`} />
                <div className="flex-grow">
                  <p className="font-medium">{getCustomerName(item.customerId)}</p>
                  <p className="text-sm text-muted-foreground">{formatTimeDifference(item.createdAt)}</p>
                </div>
                <div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    item.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    item.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentReservations;
