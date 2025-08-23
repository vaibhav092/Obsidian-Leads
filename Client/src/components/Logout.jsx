import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

function Logout() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.error('Logout failed:', err.response?.data || err.message);
        }
    };

    return (
        <Button 
            variant="destructive" 
            onClick={handleLogout} 
            className="px-4 py-2"
        >
            Logout
        </Button>
    );
}

export default Logout;
