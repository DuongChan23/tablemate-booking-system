
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const timeSlots = [
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", 
  "20:00", "20:30", "21:00", "21:30", "22:00"
];

const tableTypes = [
  { value: "regular", label: "Regular Table" },
  { value: "window", label: "Window Table" },
  { value: "booth", label: "Booth" },
  { value: "large", label: "Large Group Table" },
  { value: "private", label: "Private Room" }
];

const Reservations = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time) {
      toast({
        title: "Missing information",
        description: "Please select a date and time for your reservation.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Reservation Successful",
        description: `Your ${tableType} reservation for ${guests} guests on ${format(date, 'MMMM d, yyyy')} at ${time} has been confirmed.`,
      });
      setIsLoading(false);
      // In a real app, you might redirect to a confirmation page or dashboard
    }, 1500);
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
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="time">Time</Label>
                          <Select value={time} onValueChange={setTime}>
                            <SelectTrigger id="time">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
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
                        <p className="text-muted-foreground mb-1">Monday - Thursday: 5:00 PM - 10:00 PM</p>
                        <p className="text-muted-foreground mb-1">Friday - Saturday: 5:00 PM - 11:00 PM</p>
                        <p className="text-muted-foreground">Sunday: 5:00 PM - 9:00 PM</p>
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Reservations;
