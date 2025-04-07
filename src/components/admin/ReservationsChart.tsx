
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', reservations: 12 },
  { name: 'Tue', reservations: 19 },
  { name: 'Wed', reservations: 15 },
  { name: 'Thu', reservations: 25 },
  { name: 'Fri', reservations: 38 },
  { name: 'Sat', reservations: 42 },
  { name: 'Sun', reservations: 33 },
];

const ReservationsChart = () => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Weekly Reservations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reservations" fill="#7D2E2E" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationsChart;
