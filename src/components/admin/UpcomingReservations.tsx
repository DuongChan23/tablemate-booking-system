
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Reservation {
  name: string;
  guests: number;
  table: string;
  date: string;
  time: string;
}

const reservations: Reservation[] = [
  {
    name: 'Thompson Party',
    guests: 4,
    table: 'Table 12',
    date: 'Today',
    time: '7:30 PM'
  },
  {
    name: 'Chen Family',
    guests: 6,
    table: 'Table 8',
    date: 'Today',
    time: '8:00 PM'
  },
  {
    name: 'Williams Anniversary',
    guests: 2,
    table: 'Table 5',
    date: 'Today',
    time: '8:30 PM'
  },
  {
    name: 'Martinez Business Dinner',
    guests: 8,
    table: 'Private Room',
    date: 'Tomorrow',
    time: '6:00 PM'
  }
];

const UpcomingReservations = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Reservations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reservations.map((reservation, index) => (
            <div 
              key={index} 
              className={`flex justify-between items-start ${
                index < reservations.length - 1 ? 'border-b pb-4' : ''
              }`}
            >
              <div>
                <h3 className="font-medium">{reservation.name}</h3>
                <p className="text-sm text-muted-foreground">{reservation.guests} guests • {reservation.table}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{reservation.date}</p>
                <p className="text-sm text-muted-foreground">{reservation.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingReservations;
