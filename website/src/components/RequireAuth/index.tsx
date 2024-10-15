import * as React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RequireAuth = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    const location = useLocation();

    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Navigate to="/authenticate" state={{ from: location }} replace />
    );
};

export default RequireAuth;
