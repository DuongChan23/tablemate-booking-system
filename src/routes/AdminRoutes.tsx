import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AdminRouteProps {
  redirectTo?: string;
}

const AdminRoutes: React.FC<AdminRouteProps> = ({ redirectTo = '/login' }) => {
  const { isAdmin, isAuthenticated, loading } = useAuth();
  
  // While checking authentication status, show loading
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // If user is not authenticated or not an admin, redirect to login
  // Otherwise, render the admin routes
  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default AdminRoutes;
