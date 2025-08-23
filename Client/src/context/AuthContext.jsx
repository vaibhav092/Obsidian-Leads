import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi } from '../util/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await userApi.getProfile();
                setUser(userData);
            } catch (error) {
                console.log('User not authenticated');
                setUser(null);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        const response = await userApi.login(credentials);
        if (response.user) {
            setUser(response.user);
        }
        return response;
    };

    const register = async (userData) => {
        const response = await userApi.register(userData);
        if (response.user) {
            setUser(response.user);
        }
        return response;
    };

    const logout = async () => {
        try {
            await userApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
