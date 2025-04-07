
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardStats from '@/components/admin/DashboardStats';
import ReservationsChart from '@/components/admin/ReservationsChart';
import UpcomingReservations from '@/components/admin/UpcomingReservations';
import RecentReservations from '@/components/admin/RecentReservations';
import Notifications from '@/components/admin/Notifications';

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-serif font-bold mb-6">Dashboard</h1>
        
        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-8">
          <ReservationsChart />
          <UpcomingReservations />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentReservations />
          <Notifications />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
