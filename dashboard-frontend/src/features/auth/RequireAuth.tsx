// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { RootState } from '@/app/store';

const ProtectedRoute = ({ allowedRoles, children }: { allowedRoles?: string[], children?: React.ReactNode }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    allowedRoles &&
    (!user.roles || !user.roles.some(role => allowedRoles.includes(role)))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;