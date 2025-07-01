
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated || user?.role !== 'admin') {
        const redirectTo = user ? '/' : '/login';
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }
    return <>{children}</>;
};
