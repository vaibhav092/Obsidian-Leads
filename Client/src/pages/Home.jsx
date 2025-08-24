import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Database, FileText, Shield } from 'lucide-react';

export default function HomePage() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const features = [
        {
            icon: <Users className="w-6 h-6" />,
            title: 'Lead Storage',
            description: 'Store and organize lead information securely',
        },
        {
            icon: <Database className="w-6 h-6" />,
            title: 'Data Management',
            description: 'Manage lead data in a simple, intuitive interface',
        },
        {
            icon: <FileText className="w-6 h-6" />,
            title: 'Basic Reports',
            description: 'View basic lead information and generate reports',
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: 'Secure Access',
            description: 'Protected routes and secure user authentication',
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="px-6 py-4 border-b border-gray-800">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
                        </div>
                        <span className="text-xl font-semibold text-blue-400">Obsidian Leads</span>
                    </div>
                    <button
                        onClick={handleLoginClick}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-white font-medium"
                    >
                        Login
                    </button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        Lead Management System
                    </h1>
                    <p className="text-lg text-gray-400 mb-8">
                        A simple and efficient system to manage and organize your business leads.
                    </p>
                    <button
                        onClick={handleLoginClick}
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors text-white"
                    >
                        Get Started
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-16">
                <h2 className="text-2xl font-bold text-center mb-12 text-white">Features</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-lg bg-gray-900 border border-gray-800 hover:border-blue-500/50 transition-all duration-200 hover:bg-gray-800/50"
                        >
                            <div className="text-blue-400 mb-3">{feature.icon}</div>
                            <h3 className="text-lg font-semibold mb-2 text-white">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 text-white">
                        Ready to Manage Your Leads?
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Start organizing your business leads today with our simple and secure
                        platform.
                    </p>
                    <button
                        onClick={handleLoginClick}
                        className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-medium transition-colors text-white"
                    >
                        Start Now
                    </button>
                </div>
            </div>

            <footer className="border-t border-gray-800 py-8 mt-16">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-sm transform rotate-45"></div>
                        </div>
                        <span className="font-semibold text-blue-400">Obsidian Leads</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Lead Management System - Student Project
                    </p>
                </div>
            </footer>
        </div>
    );
}
