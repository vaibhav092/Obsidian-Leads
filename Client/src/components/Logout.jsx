import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Logout() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error('Logout failed:', err.response?.data || err.message);
        }
    };

    return (
        <button
            variant="destructive"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-red-500 hover:cursor-pointer"
        >
            Logout
        </button>
    );
}

export default Logout;
