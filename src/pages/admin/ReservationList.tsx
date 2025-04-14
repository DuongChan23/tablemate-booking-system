
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Reservation } from '@/types';
import { Search, Plus, Edit, Trash, CalendarDays } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import reservationService from '@/services/reservationService';
import customerService from '@/services/customerService';
import { format, parseISO } from 'date-fns';

const ReservationList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch reservations and customers using React Query
  const { data: reservations, isLoading: isLoadingReservations } = useQuery({
    queryKey: ['reservations'],
    queryFn: reservationService.getAll,
  });
  
  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: customerService.getAll,
  });

  // Get customer information for a reservation
  const getCustomerInfo = (customerId: string) => {
    return customers?.find(customer => customer.id === customerId);
  };

  // Filter reservations based on search term
  const filteredReservations = reservations?.filter((reservation) => {
    const customer = getCustomerInfo(reservation.customerId);
    const customerName = customer?.name || '';
    const customerEmail = customer?.email || '';
    
    return customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
           reservation.id.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-serif font-bold">Reservations</h1>
          <Button 
            className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90"
            onClick={() => {/* Add reservation dialog functionality */}}
          >
            <Plus size={16} className="mr-2" />
            Add Reservation
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search reservations..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">Filters</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <CalendarDays className="mr-2 h-5 w-5" />
              Reservation List
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingReservations ? (
              <div className="flex justify-center p-6">
                <p>Loading reservations...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Reservation Date</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Table Type</TableHead>
                    <TableHead>Special Requests</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center">
                        No reservations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReservations.map((reservation) => {
                      const customer = getCustomerInfo(reservation.customerId);
                      return (
                        <TableRow key={reservation.id}>
                          <TableCell>{reservation.id}</TableCell>
                          <TableCell>{reservation.userId}</TableCell>
                          <TableCell>{reservation.customerId}</TableCell>
                          <TableCell>{customer?.name || 'N/A'}</TableCell>
                          <TableCell>{customer?.email || 'N/A'}</TableCell>
                          <TableCell>{customer?.phone || 'N/A'}</TableCell>
                          <TableCell>
                            {format(parseISO(reservation.reservationDate), 'MMM dd, yyyy HH:mm')}
                          </TableCell>
                          <TableCell>{reservation.numberOfGuests}</TableCell>
                          <TableCell>{reservation.tableType}</TableCell>
                          <TableCell>
                            <div className="max-w-[150px] truncate">
                              {reservation.specialRequests || 'None'}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(reservation.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {/* Edit reservation */}}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {/* Delete reservation */}}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ReservationList;
