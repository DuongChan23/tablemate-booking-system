
import React from 'react';
import { Calendar, Clock, Users, UtensilsCrossed } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <Card>
    <CardContent className="p-6 flex flex-row items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      {icon}
    </CardContent>
  </Card>
);

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Today's Reservations" 
        value={24} 
        icon={<Calendar className="h-8 w-8 text-tablemate-burgundy opacity-80" />} 
      />
      
      <StatCard 
        title="Total Customers" 
        value={1248} 
        icon={<Users className="h-8 w-8 text-tablemate-burgundy opacity-80" />} 
      />
      
      <StatCard 
        title="Menu Items" 
        value={42} 
        icon={<UtensilsCrossed className="h-8 w-8 text-tablemate-burgundy opacity-80" />} 
      />
      
      <StatCard 
        title="Pending Requests" 
        value={8} 
        icon={<Clock className="h-8 w-8 text-tablemate-burgundy opacity-80" />} 
      />
    </div>
  );
};

export default DashboardStats;
