import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Reservation, Customer } from '@/types';
import { Search, Plus, Edit, Trash, Calendar, Users, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import reservationService from '@/services/reservationService';
import customerService from '@/services/customerService';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Add validation schema
const reservationSchema = z.object({
  customerName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  customerEmail: z.string().email({ message: "Please enter a valid email address" }),
  customerPhone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  reservationDate: z.string().min(1, { message: "Reservation date is required" }),
  numberOfGuests: z.coerce.number().min(1, { message: "At least 1 guest is required" }).max(20, { message: "Maximum 20 guests allowed" }),
  tableType: z.string().min(1, { message: "Table type is required" }),
  specialRequests: z.string().optional(),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

const ReservationPage = () => {
  const { user } = useAuth(); // Fixed: Changed from auth to user directly
  const [searchTerm, setSearchTerm] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Add form hooks for add and edit forms
  const addForm = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      reservationDate: '',
      numberOfGuests: 2,
      tableType: 'regular',
      specialRequests: '',
    }
  });
  
  const editForm = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      reservationDate: '',
      numberOfGuests: 2,
      tableType: 'regular',
      specialRequests: '',
    }
  });

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await reservationService.getAll();
        setReservations(data);
        
        // Also fetch customers for the dropdown
        const customersData = await customerService.getAll();
        setCustomers(customersData);
      } catch (error) {
        console.error('Failed to fetch reservations:', error);
        toast({
          title: "Error",
          description: "Failed to load reservations",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReservations();
  }, []);

  const filteredReservations = reservations.filter((reservation) => {
    // First apply search filter
    const matchesSearch = 
      reservation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.customerId.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Then apply tab filter
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && reservation.status === 'pending';
    if (activeTab === 'confirmed') return matchesSearch && reservation.status === 'confirmed';
    if (activeTab === 'cancelled') return matchesSearch && reservation.status === 'cancelled';
    if (activeTab === 'completed') return matchesSearch && reservation.status === 'completed';
    
    return matchesSearch;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddReservation = async (values: ReservationFormValues) => {
    try {
      // First check if customer exists by email
      let customer = await customerService.getByEmail(values.customerEmail);
      
      // If customer doesn't exist, create a new one
      if (!customer) {
        const newCustomer = {
          userId: user?.id || 'guest', // Fixed: Changed from auth.user?.id to user?.id
          name: values.customerName,
          email: values.customerEmail,
          phone: values.customerPhone,
          status: 'active' as 'active' | 'inactive' // Fixed: Explicitly cast to the correct union type
        };
        
        customer = await customerService.create(newCustomer);
      }
      
      // Now create the reservation
      const reservationData = {
        userId: user?.id || 'guest', // Fixed: Changed from auth.user?.id to user?.id
        customerId: customer.id,
        name: values.customerName,
        email: values.customerEmail,
        phone: values.customerPhone,
        reservationDate: values.reservationDate,
        numberOfGuests: values.numberOfGuests,
        tableType: values.tableType,
        specialRequests: values.specialRequests,
        status: 'pending' as const
      };
      
      const response = await reservationService.create(reservationData);
      setReservations([...reservations, response]);
      toast({
        title: "Success",
        description: "Reservation added successfully",
      });
      setIsAddDialogOpen(false);
      addForm.reset();
    } catch (error) {
      console.error('Failed to add reservation:', error);
      toast({
        title: "Error",
        description: "Failed to add reservation",
        variant: "destructive",
      });
    }
  };

  const handleEditReservation = async (values: ReservationFormValues) => {
    if (!editingReservation) return;
    
    try {
      // First update customer info if needed
      const customer = await customerService.getById(editingReservation.customerId);
      if (customer) {
        if (customer.name !== values.customerName || 
            customer.email !== values.customerEmail || 
            customer.phone !== values.customerPhone) {
          await customerService.update(customer.id, {
            name: values.customerName,
            email: values.customerEmail,
            phone: values.customerPhone
          });
        }
      }
      
      // Now update the reservation
      const reservationData = {
        name: values.customerName,
        email: values.customerEmail,
        phone: values.customerPhone,
        reservationDate: values.reservationDate,
        numberOfGuests: values.numberOfGuests,
        tableType: values.tableType,
        specialRequests: values.specialRequests
      };
      
      const response = await reservationService.update(editingReservation.id, reservationData);
      setReservations(reservations.map(r => r.id === response.id ? response : r));
      toast({
        title: "Success",
        description: "Reservation updated successfully",
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Failed to update reservation:', error);
      toast({
        title: "Error",
        description: "Failed to update reservation",
        variant: "destructive",
      });
    }
  };
  
  const openEditDialog = async (reservation: Reservation) => {
    setEditingReservation(reservation);
    
    // Fetch customer details
    try {
      const customer = await customerService.getById(reservation.customerId);
      if (customer) {
        editForm.reset({
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          reservationDate: reservation.reservationDate,
          numberOfGuests: reservation.numberOfGuests,
          tableType: reservation.tableType,
          specialRequests: reservation.specialRequests || ''
        });
      }
      setIsEditDialogOpen(true);
    } catch (error) {
      console.error('Failed to fetch customer details:', error);
      toast({
        title: "Error",
        description: "Failed to load customer details",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReservation = async () => {
    if (!reservationToDelete) return;
    
    try {
      await reservationService.delete(reservationToDelete.id);
      setReservations(reservations.filter(r => r.id !== reservationToDelete.id));
      toast({
        title: "Success",
        description: "Reservation deleted successfully",
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete reservation:', error);
      toast({
        title: "Error",
        description: "Failed to delete reservation",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (reservationId: string, newStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    try {
      const response = await reservationService.update(reservationId, { status: newStatus });
      setReservations(reservations.map(r => r.id === response.id ? response : r));
      toast({
        title: "Success",
        description: `Reservation status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Failed to update reservation status:', error);
      toast({
        title: "Error",
        description: "Failed to update reservation status",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-serif font-bold">Reservations</h1>
          <Button 
            className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90"
            onClick={() => setIsAddDialogOpen(true)}
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

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Reservation List</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-6">
                    <p>Loading reservations...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Guests</TableHead>
                        <TableHead>Table Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReservations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center">
                            No reservations found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredReservations.map((reservation) => (
                          <TableRow key={reservation.id}>
                            <TableCell className="font-medium">
                              {reservation.id}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                {format(parseISO(reservation.reservationDate), 'MMM d, yyyy')}
                                <Clock className="ml-4 mr-2 h-4 w-4 text-muted-foreground" />
                                {format(parseISO(reservation.reservationDate), 'h:mm a')}
                              </div>
                            </TableCell>
                            <TableCell>{reservation.customerId}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                                {reservation.numberOfGuests}
                              </div>
                            </TableCell>
                            <TableCell>{reservation.tableType}</TableCell>
                            <TableCell>
                              <Badge className={getStatusBadgeColor(reservation.status)}>
                                {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <select 
                                  className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs"
                                  value={reservation.status}
                                  onChange={(e) => handleStatusChange(
                                    reservation.id, 
                                    e.target.value as 'pending' | 'confirmed' | 'cancelled' | 'completed'
                                  )}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="cancelled">Cancelled</option>
                                  <option value="completed">Completed</option>
                                </select>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => openEditDialog(reservation)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    setReservationToDelete(reservation);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Reservation Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Reservation</DialogTitle>
            <DialogDescription>
              Fill in the reservation details below.
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddReservation)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addForm.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addForm.control}
                    name="reservationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date & Time</FormLabel>
                        <FormControl>
                          <Input {...field} type="datetime-local" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="numberOfGuests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Guests</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="1" max="20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addForm.control}
                    name="tableType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Table Type</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="regular">Regular</option>
                            <option value="window">Window</option>
                            <option value="booth">Booth</option>
                            <option value="large">Large</option>
                            <option value="private">Private Room</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={addForm.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requests</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90">Add Reservation</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Reservation Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Reservation</DialogTitle>
            <DialogDescription>
              Update the reservation details below.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditReservation)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="reservationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date & Time</FormLabel>
                        <FormControl>
                          <Input {...field} type="datetime-local" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="numberOfGuests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Guests</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="1" max="20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="tableType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Table Type</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="regular">Regular</option>
                            <option value="window">Window</option>
                            <option value="booth">Booth</option>
                            <option value="large">Large</option>
                            <option value="private">Private Room</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={editForm.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requests</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90">Update Reservation</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Reservation Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this reservation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteReservation}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ReservationPage;
