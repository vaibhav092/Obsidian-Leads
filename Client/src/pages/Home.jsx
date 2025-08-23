import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/leads" replace />;
    }

    return <Navigate to="/login" replace />;
}

export default Home;
