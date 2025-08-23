import React from 'react';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute} from './components/ProtectedRoute';
import LoginForm from './pages/LoginForm';
import Home from './pages/Home';
import Leads from './pages/Leads';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route 
                        path="/login" 
                        element={<LoginForm />} 
                    />
                    <Route 
                        path='/leads' 
                        element={
                            <ProtectedRoute>
                                <Leads />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
