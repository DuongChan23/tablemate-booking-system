import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import reservationService from '@/services/reservationService';
import { Reservation } from '@/types';
import { Clock, Calendar, Users, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'completed': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const ReservationHistory = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const userReservations = await reservationService.getUserReservations(user.id);
        setReservations(userReservations);
      } catch (error) {
        console.error('Failed to fetch reservations:', error);
        toast({
          title: "Error",
          description: "Failed to load your reservation history. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user, toast]);

  const formatReservationDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  };

  const formatReservationTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };

  const handleNewReservation = () => {
    navigate('/reservations');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-tablemate-burgundy py-12 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">Your Reservations</h1>
          <p className="max-w-2xl mx-auto">
            View and manage your upcoming and past dining experiences with us.
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-12 bg-tablemate-cream">
        <div className="container mx-auto px-4">
          <div className="flex justify-end mb-6">
            <Button 
              onClick={handleNewReservation}
              className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90"
            >
              Make New Reservation
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Your Reservation History</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p>Loading your reservations...</p>
                </div>
              ) : reservations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You don't have any reservations yet.</p>
                  <Button 
                    onClick={handleNewReservation}
                    className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90"
                  >
                    Make Your First Reservation
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Upcoming Reservations</h3>
                  
                  <div className="grid gap-4">
                    {reservations
                      .filter(r => ['pending', 'confirmed'].includes(r.status))
                      .sort((a, b) => new Date(a.reservationDate).getTime() - new Date(b.reservationDate).getTime())
                      .map((reservation) => (
                        <Card key={reservation.id} className="overflow-hidden">
                          <div className={`h-1 ${
                            reservation.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'
                          }`} />
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row justify-between">
                              <div className="mb-4 lg:mb-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={getStatusColor(reservation.status)}>
                                    {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    Booking ID: #{reservation.id}
                                  </span>
                                </div>
                                
                                <h3 className="text-xl font-medium mb-2">
                                  Table for {reservation.numberOfGuests} {reservation.numberOfGuests === 1 ? 'person' : 'people'}
                                </h3>
                                
                                <div className="grid gap-2">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>{formatReservationDate(reservation.reservationDate)}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>{formatReservationTime(reservation.reservationDate)}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>{reservation.tableType} table</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col gap-2">
                                <Button variant="outline" size="sm" className="justify-start">
                                  Modify Reservation
                                </Button>
                                <Button variant="outline" size="sm" className="justify-start text-red-600 border-red-200 hover:bg-red-50">
                                  Cancel Reservation
                                </Button>
                              </div>
                            </div>
                            
                            {reservation.specialRequests && (
                              <div className="mt-4 p-3 bg-muted/50 rounded-md">
                                <p className="text-sm font-medium mb-1">Special Requests:</p>
                                <p className="text-sm text-muted-foreground">{reservation.specialRequests}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>

                  <h3 className="text-lg font-medium mt-8">Past Reservations</h3>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Party Size</TableHead>
                        <TableHead>Table Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservations
                        .filter(r => ['completed', 'cancelled'].includes(r.status))
                        .sort((a, b) => new Date(b.reservationDate).getTime() - new Date(a.reservationDate).getTime())
                        .map((reservation) => (
                          <TableRow key={reservation.id}>
                            <TableCell>{formatReservationDate(reservation.reservationDate)}</TableCell>
                            <TableCell>{formatReservationTime(reservation.reservationDate)}</TableCell>
                            <TableCell>{reservation.numberOfGuests} people</TableCell>
                            <TableCell>{reservation.tableType}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(reservation.status)}>
                                {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={handleNewReservation}>
                                Book Again
                                <ArrowRight className="ml-1 h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReservationHistory;
