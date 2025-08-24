import Logout from '@/components/Logout';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { leadApi } from '../util/api';

function Leads() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [limit, setLimit] = useState(20);
    const [page, setPage] = useState(1);
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await leadApi.getAll({
                    params: { page, limit },
                });

                console.log(data);
                setData(response);
            } catch (error) {
                console.error('Error fetching leads:', error);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchData();
    }, [page, limit, navigate]);

    const handleHomeClick = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
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

                <div className="bg-neutral-800 rounded-lg p-6"></div>
            </div>
        </div>
    );
}

export default Leads;
