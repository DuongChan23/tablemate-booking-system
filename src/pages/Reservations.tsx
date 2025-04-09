
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addMinutes } from 'date-fns';
import { CalendarIcon, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import reservationService from '@/services/reservationService';
import { Reservation } from '@/types';

const tableTypes = [
  { value: "regular", label: "Regular Table" },
  { value: "window", label: "Window Table" },
  { value: "booth", label: "Booth" },
  { value: "large", label: "Large Group Table" },
  { value: "private", label: "Private Room" }
];

const Reservations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hours, setHours] = useState<string>("19");
  const [minutes, setMinutes] = useState<string>("00");
  const [guests, setGuests] = useState<string>("2");
  const [tableType, setTableType] = useState<string>("regular");
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reservationDetails, setReservationDetails] = useState<any>(null);

  // Auto-fill form data from user information when logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      // Split name into first and last name if available
      const nameParts = user.firstName ? user.firstName.split(' ') : [''];
      const firstName = nameParts[0] || '';
      const lastName = user.lastName || '';
      
      setFormData({
        firstName: firstName,
        lastName: lastName,
        email: user.email || '',
        phone: '',  // We might not have this in the user object
        specialRequests: ''
      });
    }
  }, [isAuthenticated, user]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getReservationDateTime = () => {
    if (!date) return null;
    
    const reservationDate = new Date(date);
    reservationDate.setHours(parseInt(hours, 10));
    reservationDate.setMinutes(parseInt(minutes, 10));
    
    return reservationDate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast({
        title: "Missing information",
        description: "Please select a date for your reservation.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    const reservationDateTime = getReservationDateTime();
    if (!reservationDateTime) return;
    
    // In a real app, this would create an actual reservation
    try {
      // Here we would normally match the customer with the user or create a new customer
      // For this demo, we're creating a simple reservation
      const reservationData = {
        userId: user?.id || 'guest', 
        customerId: 'cust1', // In a real app, this would be looked up or created
        reservationDate: reservationDateTime.toISOString(),
        numberOfGuests: parseInt(guests, 10),
        tableType,
        specialRequests: formData.specialRequests || undefined,
        status: 'pending' as const  // Type assertion to ensure correct typing
      };
      
      // Create the reservation in our mock service
      const newReservation = await reservationService.create(reservationData);
      
      setReservationDetails({
        date: format(reservationDateTime, 'EEEE, MMMM d, yyyy'),
        time: format(reservationDateTime, 'h:mm a'),
        guests: guests,
        tableType: tableTypes.find(t => t.value === tableType)?.label || tableType
      });
      
      setIsSuccess(true);
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Reservation Failed",
        description: "There was a problem creating your reservation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialRequests: ''
    });
    setDate(undefined);
    setHours("19");
    setMinutes("00");
    setGuests("2");
    setTableType("regular");
  };

  const handleViewReservations = () => {
    navigate('/reservation-history');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-tablemate-burgundy py-16 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Book Your Table</h1>
          <p className="max-w-2xl mx-auto">
            Reserve your dining experience with us. Special occasions, business dinners, or intimate gatherings—we'll make it memorable.
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-12 bg-tablemate-cream">
        <div className="container mx-auto px-4">
          {isSuccess ? (
            <div className="max-w-lg mx-auto">
              <Card className="border-green-200 shadow-lg">
                <CardContent className="pt-6 text-center">
                  <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                  <h2 className="text-2xl font-serif font-bold mb-2">Reservation Confirmed!</h2>
                  <p className="text-muted-foreground mb-6">
                    We've received your reservation request and will confirm it shortly.
                  </p>
                  
                  <div className="bg-muted/40 rounded-lg p-4 mb-6">
                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{reservationDetails?.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium">{reservationDetails?.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Party Size:</span>
                        <span className="font-medium">{reservationDetails?.guests} {parseInt(reservationDetails?.guests, 10) === 1 ? 'guest' : 'guests'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Table Type:</span>
                        <span className="font-medium">{reservationDetails?.tableType}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-6">
                    A confirmation email has been sent to your email address. Please contact us if you need to make any changes.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {!isAdmin && (
                      <Button 
                        variant="outline" 
                        onClick={handleViewReservations} 
                        className="flex-1"
                      >
                        View My Reservations
                      </Button>
                    )}
                    <Button 
                      onClick={handleReset} 
                      className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90 flex-1"
                    >
                      Book Another Table <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-serif font-bold mb-6">Make a Reservation</h2>
                
                <Card>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input 
                              id="firstName" 
                              name="firstName" 
                              value={formData.firstName}
                              onChange={handleChange}
                              required 
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input 
                              id="lastName" 
                              name="lastName" 
                              value={formData.lastName}
                              onChange={handleChange}
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
                            value={formData.email}
                            onChange={handleChange}
                            required 
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            type="tel" 
                            value={formData.phone}
                            onChange={handleChange}
                            required 
                          />
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
                                className="pointer-events-auto"
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
                            rows={4}
                            value={formData.specialRequests}
                            onChange={handleChange}
                            placeholder="Please let us know if you have any special requirements or occasions to celebrate."
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90"
                          disabled={isLoading}
                        >
                          {isLoading ? "Processing..." : "Reserve Table"}
                        </Button>
                        
                        {isAuthenticated && !isAdmin && (
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={handleViewReservations}
                          >
                            View My Reservations
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-6">Reservation Information</h2>
                  
                  <Card className="bg-white">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-2 text-lg">Hours of Operation</h3>
                          <p className="text-muted-foreground mb-1">Monday - Thursday: 12:00 PM - 10:00 PM</p>
                          <p className="text-muted-foreground mb-1">Friday - Saturday: 12:00 PM - 11:00 PM</p>
                          <p className="text-muted-foreground">Sunday: 12:00 PM - 9:00 PM</p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2 text-lg">Reservation Policy</h3>
                          <p className="text-muted-foreground mb-3">
                            Reservations are held for 15 minutes past the scheduled time. Please call if you're running late.
                          </p>
                          <p className="text-muted-foreground">
                            For parties of 8 or more, please contact us directly at (555) 123-4567.
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2 text-lg">Cancellation Policy</h3>
                          <p className="text-muted-foreground">
                            Cancellations must be made at least 24 hours in advance to avoid a $25 per person cancellation fee.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-6">Contact Us</h2>
                  
                  <Card className="bg-white">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <p className="text-muted-foreground mb-1">
                          <strong>Phone:</strong> (555) 123-4567
                        </p>
                        <p className="text-muted-foreground mb-1">
                          <strong>Email:</strong> reservations@tablemate.com
                        </p>
                        <p className="text-muted-foreground">
                          <strong>Address:</strong> 123 Restaurant Avenue, Gourmet City, GC 12345
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Reservations;
