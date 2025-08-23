import Logout from '@/components/Logout'
import React from 'react'
import { useAuth } from '../context/AuthContext'

function Leads() {
  const { user } = useAuth();

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
          <Logout />
        </div>
        
        <div className="bg-neutral-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Leads</h2>
          <p className="text-neutral-400">
            Your leads will appear here. This is a protected page that only authenticated users can access.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Leads