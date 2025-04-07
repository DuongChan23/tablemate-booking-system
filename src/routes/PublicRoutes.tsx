import React from 'react';
import { Navigate, Outlet, RouteProps } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface PublicRouteProps {
  redirectTo?: string;
}

const PublicRoutes: React.FC<PublicRouteProps> = ({ redirectTo = '/' }) => {
  const { isAuthenticated } = useAuth();
  
  // If user is authenticated, redirect them to the redirectTo path
  // Otherwise, render the child routes
  return isAuthenticated ? <Navigate to={redirectTo} replace /> : <Outlet />;
};

export default PublicRoutes;
