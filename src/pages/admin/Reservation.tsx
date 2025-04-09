import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Reservation as ReservationType } from '@/types';
import { Search, Plus, Edit, Trash, Check, X, CalendarIcon, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import reservationService from '@/services/reservationService';
import customerService from '@/services/customerService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addMinutes } from 'date-fns';
import { z } from 'zod';

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

const phoneSchema = z.string().regex(/^0\d{9}$/, "Phone number must be 10 digits and start with 0");
const emailSchema = z.string().email("Please enter a valid email address");

const tableTypes = [
  { value: "regular", label: "Regular Table" },
  { value: "window", label: "Window Table" },
  { value: "booth", label: "Booth" },
  { value: "large", label: "Large Group Table" },
  { value: "private", label: "Private Room" }
];

// Generate hours array (12pm - 10pm for restaurant hours)
const hoursOptions = Array.from({ length: 11 }, (_, i) => {
  const hour = i + 12; // Start from 12 (12pm)
  return { value: String(hour), label: hour > 12 ? `${hour - 12}` : `${hour}` };
});

// Generate minutes array (00, 15, 30, 45)
const minutesOptions = ["00", "15", "30", "45"].map(minute => ({ 
  value: minute, 
  label: minute 
}));

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
  
  // Form state for new reservations - updated to match the user reservation form
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hours, setHours] = useState<string>("19");
  const [minutes, setMinutes] = useState<string>("00");
  const [guests, setGuests] = useState<string>("2");
  const [tableType, setTableType] = useState<string>("regular");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  
  const [newReservation, setNewReservation] = useState({
    userId: 'user1', // Default user ID
    customerId: '', 
    customerName: '',
    firstName: '',
    lastName: '',
    customerPhone: '',
    customerEmail: '',
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

  const validateForm = () => {
    let isValid = true;
    
    // Validate phone
    try {
      phoneSchema.parse(newReservation.customerPhone);
      setPhoneError(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setPhoneError(error.errors[0].message);
        isValid = false;
      }
    }
    
    // Validate email
    try {
      emailSchema.parse(newReservation.customerEmail);
      setEmailError(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
        isValid = false;
      }
    }
    
    return isValid;
  };

  const getReservationDateTime = () => {
    if (!date) return null;
    
    const reservationDate = new Date(date);
    reservationDate.setHours(parseInt(hours, 10));
    reservationDate.setMinutes(parseInt(minutes, 10));
    
    return reservationDate;
  };

  const handleNewReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!date) {
      toast({
        title: "Missing information",
        description: "Please select a date for the reservation.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Format the customer name from first and last name
      const customerName = `${newReservation.firstName} ${newReservation.lastName}`;
      
      // Check if customer exists
      let customerId = newReservation.customerId;
      if (!customerId) {
        // Create a new customer if one doesn't exist
        const newCustomer = await customerService.create({
          name: customerName,
          email: newReservation.customerEmail,
          phone: newReservation.customerPhone,
          address: '',
          status: 'active'
        });
        customerId = newCustomer.id;
      }

      const reservationDateTime = getReservationDateTime();
      if (!reservationDateTime) return;

      // Create the reservation
      const reservationData = {
        userId: newReservation.userId,
        customerId: customerId,
        reservationDate: reservationDateTime.toISOString(),
        numberOfGuests: parseInt(guests, 10),
        tableType: tableType,
        specialRequests: newReservation.specialRequests,
        status: newReservation.status
      };
      
      const createdReservation = await reservationService.create(reservationData);
      
      // Update the customers info
      setCustomers({
        ...customers,
        [customerId]: { name: customerName, phone: newReservation.customerPhone }
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
        firstName: '',
        lastName: '',
        customerPhone: '',
        customerEmail: '',
        specialRequests: '',
        status: 'pending'
      });
      setDate(undefined);
      setHours("19");
      setMinutes("00");
      setGuests("2");
      setTableType("regular");
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

      {/* Add Reservation Dialog - Updated to match user form */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Reservation</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new reservation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNewReservationSubmit} className="space-y-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    value={newReservation.firstName}
                    onChange={(e) => setNewReservation({...newReservation, firstName: e.target.value})}
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    value={newReservation.lastName}
                    onChange={(e) => setNewReservation({...newReservation, lastName: e.target.value})}
                    required 
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={newReservation.customerEmail}
                  onChange={(e) => setNewReservation({...newReservation, customerEmail: e.target.value})}
                  required 
                />
                {emailError && <p className="text-sm text-red-500">{emailError}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  value={newReservation.customerPhone}
                  onChange={(e) => setNewReservation({...newReservation, customerPhone: e.target.value})}
                  required 
                />
                {phoneError && <p className="text-sm text-red-500">{phoneError}</p>}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'MMMM d, yyyy') : <span>Select a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => {
                        // Disable dates in the past
                        return date < new Date(new Date().setHours(0, 0, 0, 0));
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label>Time</Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <Select value={hours} onValueChange={setHours}>
                      <SelectTrigger>
                        <SelectValue placeholder="Hour" />
                      </SelectTrigger>
                      <SelectContent>
                        {hoursOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={minutes} onValueChange={setMinutes}>
                      <SelectTrigger>
                        <SelectValue placeholder="Minute" />
                      </SelectTrigger>
                      <SelectContent>
                        {minutesOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {parseInt(hours) >= 12 ? 'PM' : 'AM'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Our dinner service runs from 12:00 PM to 10:00 PM
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger id="guests">
                      <SelectValue placeholder="Select guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'guest' : 'guests'}
                        </SelectItem>
                      ))}
                      <SelectItem value="9+">9+ guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="tableType">Table Type</Label>
                  <Select value={tableType} onValueChange={setTableType}>
                    <SelectTrigger id="tableType">
                      <SelectValue placeholder="Select table type" />
                    </SelectTrigger>
                    <SelectContent>
                      {tableTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea 
                  id="specialRequests" 
                  name="specialRequests" 
                  rows={3}
                  value={newReservation.specialRequests}
                  onChange={(e) => setNewReservation({...newReservation, specialRequests: e.target.value})}
                  placeholder="Please let us know if you have any special requirements or occasions to celebrate."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newReservation.status} 
                  onValueChange={(value: 'pending' | 'confirmed' | 'cancelled' | 'completed') => 
                    setNewReservation({...newReservation, status: value})
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                type="submit" 
                className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90"
              >
                Create Reservation
              </Button>
            </div>
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
