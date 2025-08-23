import Logout from '@/components/Logout';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Leads() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleHomeClick = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Lead Management System</h1>
                        <p className="text-neutral-400">
                            Welcome back, {user?.firstName || 'User'}!
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleHomeClick}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-white font-medium"
                        >
                            Home
                        </button>
                        <Logout />
                    </div>
                </div>

                <div className="bg-neutral-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Your Leads</h2>
                    <p className="text-neutral-400">
                        Your leads will appear here. This is a protected page that only
                        authenticated users can access.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Leads;
