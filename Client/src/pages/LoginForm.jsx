import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../context/AuthContext';

function LoginForm() {
    const navigate = useNavigate();
    
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (error) setError('');
    };

    const handleTabChange = (isLoginTab) => {
        setIsLogin(isLoginTab);
        setError('');
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            if (isLogin) {
                await login({
                    email: formData.email,
                    password: formData.password,
                });
            } else {
                await register({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                });
            }

            navigate('/leads');
        } catch (err) {
            console.error('API Error:', err);
            setError(
                err.response?.data?.message ||
                    err.message ||
                    'Something went wrong. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-neutral-900/80 border-neutral-800 shadow-2xl">
                <CardContent className="p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-white mb-2">LeadMS</h1>
                        <p className="text-neutral-400">Manage your leads efficiently</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex mb-6 bg-neutral-800/50 rounded-xl p-1">
                        <button
                            type="button"
                            onClick={() => handleTabChange(true)}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                                isLogin
                                    ? 'bg-blue-600 text-white'
                                    : 'text-neutral-400 hover:text-white'
                            }`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTabChange(false)}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                                !isLogin
                                    ? 'bg-blue-600 text-white'
                                    : 'text-neutral-400 hover:text-white'
                            }`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName" className="text-neutral-300">
                                        First Name
                                    </Label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        placeholder="First name"
                                        value={formData.firstName}
                                        onChange={(e) =>
                                            handleInputChange('firstName', e.target.value)
                                        }
                                        required={!isLogin}
                                        className="mt-2 bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="lastName" className="text-neutral-300">
                                        Last Name
                                    </Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        placeholder="Last name"
                                        value={formData.lastName}
                                        onChange={(e) =>
                                            handleInputChange('lastName', e.target.value)
                                        }
                                        required={!isLogin}
                                        className="mt-2 bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <Label htmlFor="email" className="text-neutral-300">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                required
                                className="mt-2 bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" className="text-neutral-300">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                required
                                className="mt-2 bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400"
                                disabled={isSubmitting}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Please wait...
                                </div>
                            ) : isLogin ? (
                                'Sign In'
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default LoginForm;
