
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Reservation as ReservationType } from '@/types';
import { Search, Plus, Edit, Trash, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import reservationService from '@/services/reservationService';
import customerService from '@/services/customerService';

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
  const [reservations, setReservations] = useState<ReservationType[]>([]);
  const [customers, setCustomers] = useState<Record<string, { name: string, phone: string }>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  
  const [newReservation, setNewReservation] = useState({
    userId: 'user1', // Default user ID
    customerId: '', 
    customerName: '',
    customerPhone: '',
    reservationDate: '',
    numberOfGuests: 2,
    tableType: 'regular',
    specialRequests: '',
    status: 'pending' as 'pending' | 'confirmed' | 'cancelled' | 'completed'
  });
  
  const [editingReservation, setEditingReservation] = useState<ReservationType | null>(null);
  const [reservationToDelete, setReservationToDelete] = useState<ReservationType | null>(null);
  const [reservationToConfirm, setReservationToConfirm] = useState<ReservationType | null>(null);
  const [reservationToCancel, setReservationToCancel] = useState<ReservationType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch reservations
        const reservationsData = await reservationService.getAll();
        setReservations(reservationsData);
        
        // Fetch customer info for each reservation
        const customerInfo: Record<string, { name: string, phone: string }> = {};
        for (const reservation of reservationsData) {
          if (!customerInfo[reservation.customerId]) {
            const customer = await reservationService.getCustomerInfo(reservation.customerId);
            customerInfo[reservation.customerId] = customer;
          }
        }
        setCustomers(customerInfo);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load reservation data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredReservations = reservations
    .filter((reservation) => {
      // Filter by search term
      const customerName = customers[reservation.customerId]?.name.toLowerCase() || '';
      return customerName.includes(searchTerm.toLowerCase()) ||
             reservation.id.includes(searchTerm);
    })
    .filter((reservation) => {
      // Filter by status tab
      if (activeTab === 'all') return true;
      return reservation.status === activeTab;
    });

  const handleNewReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Check if customer exists
      let customerId = newReservation.customerId;
      if (!customerId && newReservation.customerName) {
        // Create a new customer if one doesn't exist
        const newCustomer = await customerService.create({
          name: newReservation.customerName,
          email: '',
          phone: newReservation.customerPhone,
          address: '',
          status: 'active'
        });
        customerId = newCustomer.id;
      }

      // Create the reservation
      const reservationData = {
        userId: newReservation.userId,
        customerId: customerId,
        reservationDate: newReservation.reservationDate,
        numberOfGuests: newReservation.numberOfGuests,
        tableType: newReservation.tableType,
        specialRequests: newReservation.specialRequests,
        status: newReservation.status
      };
      
      const createdReservation = await reservationService.create(reservationData);
      
      // Update the customers info
      setCustomers({
        ...customers,
        [customerId]: { name: newReservation.customerName, phone: newReservation.customerPhone }
      });
      
      // Update the reservations list
      setReservations([...reservations, createdReservation]);
      
      toast({
        title: "Success",
        description: "Reservation created successfully",
      });
      
      // Reset form and close dialog
      setNewReservation({
        userId: 'user1',
        customerId: '',
        customerName: '',
        customerPhone: '',
        reservationDate: '',
        numberOfGuests: 2,
        tableType: 'regular',
        specialRequests: '',
        status: 'pending'
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Error",
        description: "Failed to create reservation",
        variant: "destructive",
      });
    }
  };

  const handleEditReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReservation) return;
    
    try {
      const updatedReservation = await reservationService.update(
        editingReservation.id, 
        editingReservation
      );
      
      setReservations(reservations.map(r => 
        r.id === updatedReservation.id ? updatedReservation : r
      ));
      
      toast({
        title: "Success",
        description: "Reservation updated successfully",
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast({
        title: "Error",
        description: "Failed to update reservation",
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
      console.error('Error deleting reservation:', error);
      toast({
        title: "Error",
        description: "Failed to delete reservation",
        variant: "destructive",
      });
    }
  };

  const handleConfirmReservation = async () => {
    if (!reservationToConfirm) return;
    
    try {
      const updatedReservation = await reservationService.update(
        reservationToConfirm.id,
        { ...reservationToConfirm, status: 'confirmed' as const }
      );
      
      setReservations(reservations.map(r => 
        r.id === updatedReservation.id ? updatedReservation : r
      ));
      
      toast({
        title: "Success",
        description: "Reservation confirmed successfully",
      });
      
      setIsConfirmDialogOpen(false);
    } catch (error) {
      console.error('Error confirming reservation:', error);
      toast({
        title: "Error",
        description: "Failed to confirm reservation",
        variant: "destructive",
      });
    }
  };

  const handleCancelReservation = async () => {
    if (!reservationToCancel) return;
    
    try {
      const updatedReservation = await reservationService.update(
        reservationToCancel.id,
        { ...reservationToCancel, status: 'cancelled' as const }
      );
      
      setReservations(reservations.map(r => 
        r.id === updatedReservation.id ? updatedReservation : r
      ));
      
      toast({
        title: "Success",
        description: "Reservation cancelled successfully",
      });
      
      setIsCancelDialogOpen(false);
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast({
        title: "Error",
        description: "Failed to cancel reservation",
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
                {isLoading ? (
                  <div className="flex justify-center p-6">
                    <p>Loading reservations...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Guests</TableHead>
                        <TableHead>Table Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReservations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
                                  {customers[reservation.customerId]?.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {customers[reservation.customerId]?.phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(reservation.reservationDate)}</TableCell>
                            <TableCell>{reservation.numberOfGuests} people</TableCell>
                            <TableCell>{reservation.tableType}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(reservation.status)}`}>
                                {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {reservation.status === 'pending' && (
                                  <>
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="text-green-600"
                                      onClick={() => {
                                        setReservationToConfirm(reservation);
                                        setIsConfirmDialogOpen(true);
                                      }}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="text-red-600"
                                      onClick={() => {
                                        setReservationToCancel(reservation);
                                        setIsCancelDialogOpen(true);
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => {
                                    setEditingReservation(reservation);
                                    setIsEditDialogOpen(true);
                                  }}
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Add Reservation Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Reservation</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new reservation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNewReservationSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={newReservation.customerName}
                  onChange={(e) => setNewReservation({...newReservation, customerName: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="customerPhone">Customer Phone</Label>
                <Input
                  id="customerPhone"
                  value={newReservation.customerPhone}
                  onChange={(e) => setNewReservation({...newReservation, customerPhone: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="reservationDate">Reservation Date & Time</Label>
                <Input
                  id="reservationDate"
                  type="datetime-local"
                  value={newReservation.reservationDate}
                  onChange={(e) => setNewReservation({...newReservation, reservationDate: e.target.value})}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="numberOfGuests">Number of Guests</Label>
                <Input
                  id="numberOfGuests"
                  type="number"
                  min="1"
                  value={newReservation.numberOfGuests}
                  onChange={(e) => setNewReservation({...newReservation, numberOfGuests: parseInt(e.target.value)})}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="tableType">Table Type</Label>
                <select
                  id="tableType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newReservation.tableType}
                  onChange={(e) => setNewReservation({...newReservation, tableType: e.target.value})}
                  required
                >
                  <option value="regular">Regular</option>
                  <option value="window">Window</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="private">Private</option>
                  <option value="large">Large Group</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Input
                  id="specialRequests"
                  value={newReservation.specialRequests}
                  onChange={(e) => setNewReservation({...newReservation, specialRequests: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newReservation.status}
                  onChange={(e) => setNewReservation({
                    ...newReservation, 
                    status: e.target.value as 'pending' | 'confirmed' | 'cancelled' | 'completed'
                  })}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90">
                Create Reservation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Reservation Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Reservation</DialogTitle>
            <DialogDescription>
              Update the reservation details.
            </DialogDescription>
          </DialogHeader>
          {editingReservation && (
            <form onSubmit={handleEditReservation}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-reservationDate">Reservation Date & Time</Label>
                  <Input
                    id="edit-reservationDate"
                    type="datetime-local"
                    value={editingReservation.reservationDate}
                    onChange={(e) => setEditingReservation({
                      ...editingReservation, 
                      reservationDate: e.target.value
                    })}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-numberOfGuests">Number of Guests</Label>
                  <Input
                    id="edit-numberOfGuests"
                    type="number"
                    min="1"
                    value={editingReservation.numberOfGuests}
                    onChange={(e) => setEditingReservation({
                      ...editingReservation, 
                      numberOfGuests: parseInt(e.target.value)
                    })}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-tableType">Table Type</Label>
                  <select
                    id="edit-tableType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editingReservation.tableType}
                    onChange={(e) => setEditingReservation({
                      ...editingReservation, 
                      tableType: e.target.value
                    })}
                    required
                  >
                    <option value="regular">Regular</option>
                    <option value="window">Window</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="private">Private</option>
                    <option value="large">Large Group</option>
                  </select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-specialRequests">Special Requests</Label>
                  <Input
                    id="edit-specialRequests"
                    value={editingReservation.specialRequests || ''}
                    onChange={(e) => setEditingReservation({
                      ...editingReservation, 
                      specialRequests: e.target.value
                    })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editingReservation.status}
                    onChange={(e) => setEditingReservation({
                      ...editingReservation, 
                      status: e.target.value as 'pending' | 'confirmed' | 'cancelled' | 'completed'
                    })}
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90">
                  Update Reservation
                </Button>
              </DialogFooter>
            </form>
          )}
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

      {/* Confirm Reservation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Reservation</DialogTitle>
            <DialogDescription>
              Are you sure you want to confirm this reservation?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="default" 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleConfirmReservation}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Reservation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Reservation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this reservation?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>No</Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelReservation}
            >
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ReservationPage;
