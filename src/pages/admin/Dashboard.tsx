
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users, UtensilsCrossed, CalendarCheck, AlertCircle } from 'lucide-react';
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

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-serif font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex flex-row items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Today's Reservations</p>
                <p className="text-3xl font-bold">24</p>
              </div>
              <Calendar className="h-8 w-8 text-tablemate-burgundy opacity-80" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-row items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Customers</p>
                <p className="text-3xl font-bold">1,248</p>
              </div>
              <Users className="h-8 w-8 text-tablemate-burgundy opacity-80" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-row items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Menu Items</p>
                <p className="text-3xl font-bold">42</p>
              </div>
              <UtensilsCrossed className="h-8 w-8 text-tablemate-burgundy opacity-80" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-row items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Requests</p>
                <p className="text-3xl font-bold">8</p>
              </div>
              <Clock className="h-8 w-8 text-tablemate-burgundy opacity-80" />
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reservations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <h3 className="font-medium">Thompson Party</h3>
                    <p className="text-sm text-muted-foreground">4 guests • Table 12</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Today</p>
                    <p className="text-sm text-muted-foreground">7:30 PM</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <h3 className="font-medium">Chen Family</h3>
                    <p className="text-sm text-muted-foreground">6 guests • Table 8</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Today</p>
                    <p className="text-sm text-muted-foreground">8:00 PM</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <h3 className="font-medium">Williams Anniversary</h3>
                    <p className="text-sm text-muted-foreground">2 guests • Table 5</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Today</p>
                    <p className="text-sm text-muted-foreground">8:30 PM</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Martinez Business Dinner</h3>
                    <p className="text-sm text-muted-foreground">8 guests • Private Room</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Tomorrow</p>
                    <p className="text-sm text-muted-foreground">6:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reservations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'James Wilson', time: '10 minutes ago', status: 'confirmed' },
                  { name: 'Emily Rodriguez', time: '25 minutes ago', status: 'confirmed' },
                  { name: 'Michael Johnson', time: '45 minutes ago', status: 'pending' },
                  { name: 'Sarah Thompson', time: '1 hour ago', status: 'confirmed' },
                  { name: 'David Lee', time: '2 hours ago', status: 'cancelled' }
                ].map((item, index) => (
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
          
          <Card>
            <CardHeader>
              <CardTitle>Important Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start pb-4 border-b">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Limited Tables for Friday</h4>
                    <p className="text-sm text-muted-foreground">Only 4 tables left for Friday evening. Consider adjusting reservation availability.</p>
                  </div>
                </div>
                
                <div className="flex items-start pb-4 border-b">
                  <CalendarCheck className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Special Event Next Week</h4>
                    <p className="text-sm text-muted-foreground">Wine tasting event scheduled for next Thursday. 25 attendees confirmed.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Staff Meeting Reminder</h4>
                    <p className="text-sm text-muted-foreground">Monthly staff meeting tomorrow at 2:00 PM. Please prepare menu suggestions.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
