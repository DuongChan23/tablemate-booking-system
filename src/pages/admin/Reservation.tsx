
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Reservation as ReservationType } from '@/types';
import { Search, Plus, Edit, Trash, Check, X } from 'lucide-react';

// Format date string for display
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

// Mock data for reservations
const mockReservations: ReservationType[] = [
  {
    id: '1',
    customerId: 'cust1',
    dateTime: '2025-04-10T18:30:00',
    guests: 4,
    specialRequests: 'Window seat preferred',
    status: 'confirmed',
    createdAt: '2025-04-01T10:15:00'
  },
  {
    id: '2',
    customerId: 'cust2',
    dateTime: '2025-04-10T19:00:00',
    guests: 2,
    specialRequests: 'Anniversary dinner',
    status: 'pending',
    createdAt: '2025-04-02T09:20:00'
  },
  {
    id: '3',
    customerId: 'cust3',
    dateTime: '2025-04-11T20:15:00',
    guests: 6,
    status: 'confirmed',
    createdAt: '2025-04-02T14:30:00'
  },
  {
    id: '4',
    customerId: 'cust4',
    dateTime: '2025-04-09T17:45:00',
    guests: 3,
    specialRequests: 'High chair needed',
    status: 'completed',
    createdAt: '2025-04-01T11:05:00'
  },
  {
    id: '5',
    customerId: 'cust5',
    dateTime: '2025-04-12T21:00:00',
    guests: 8,
    specialRequests: 'Business dinner, private room if possible',
    status: 'cancelled',
    createdAt: '2025-04-03T16:45:00'
  }
];

// Mock customer data for demonstration
const mockCustomers: Record<string, { name: string, phone: string }> = {
  'cust1': { name: 'John Doe', phone: '555-123-4567' },
  'cust2': { name: 'Jane Smith', phone: '555-987-6543' },
  'cust3': { name: 'Robert Johnson', phone: '555-555-5555' },
  'cust4': { name: 'Emily Williams', phone: '555-222-3333' },
  'cust5': { name: 'Michael Brown', phone: '555-777-8888' }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'completed': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const ReservationPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [reservations] = useState<ReservationType[]>(mockReservations);

  const filteredReservations = reservations
    .filter((reservation) => {
      // Filter by search term
      const customerName = mockCustomers[reservation.customerId]?.name.toLowerCase() || '';
      return customerName.includes(searchTerm.toLowerCase()) ||
             reservation.id.includes(searchTerm);
    })
    .filter((reservation) => {
      // Filter by status tab
      if (activeTab === 'all') return true;
      return reservation.status === activeTab;
    });

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-serif font-bold">Reservations</h1>
          <Button className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90">
            <Plus size={16} className="mr-2" />
            New Reservation
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search reservations by name or ID..." 
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
            <CardTitle>Reservation Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Guests</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReservations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No reservations found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                          <TableCell>#{reservation.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {mockCustomers[reservation.customerId]?.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {mockCustomers[reservation.customerId]?.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(reservation.dateTime)}</TableCell>
                          <TableCell>{reservation.guests} people</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(reservation.status)}`}>
                              {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {reservation.status === 'pending' && (
                                <>
                                  <Button size="icon" variant="ghost" className="text-green-600">
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost" className="text-red-600">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ReservationPage;
