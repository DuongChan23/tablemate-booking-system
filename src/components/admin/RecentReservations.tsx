
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RecentReservation {
  name: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

const recentReservations: RecentReservation[] = [
  { name: 'James Wilson', time: '10 minutes ago', status: 'confirmed' },
  { name: 'Emily Rodriguez', time: '25 minutes ago', status: 'confirmed' },
  { name: 'Michael Johnson', time: '45 minutes ago', status: 'pending' },
  { name: 'Sarah Thompson', time: '1 hour ago', status: 'confirmed' },
  { name: 'David Lee', time: '2 hours ago', status: 'cancelled' }
];

const RecentReservations = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Reservations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentReservations.map((item, index) => (
            <div key={index} className={`flex items-center ${index < 4 ? 'border-b pb-4' : ''}`}>
              <div className={`w-2 h-2 rounded-full mr-3 ${
                item.status === 'confirmed' ? 'bg-green-500' : 
                item.status === 'pending' ? 'bg-yellow-500' : 
                'bg-red-500'
              }`} />
              <div className="flex-grow">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.time}</p>
              </div>
              <div>
                <span className={`text-xs px-2 py-1 rounded ${
                  item.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                  item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentReservations;
