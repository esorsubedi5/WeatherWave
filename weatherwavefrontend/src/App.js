import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavbarComponent from './components/Navbar'; // Adjust the import path as needed
import Login from './components/user/Login';
import Register from './components/user/Register';
import User from './components/user/User';
import Dashboard from './components/Dashboard';
import WeatherDashboard from './components/weatherwave/WeatherDashboard';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <NavbarComponent isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <div>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/me" element={isLoggedIn ? <User /> : <Login onLogin={handleLogin} />} />
                    <Route path="/user" element={isLoggedIn ? <User /> : <Login onLogin={handleLogin} />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/weatherdashboard" element={<WeatherDashboard />} />
                    {/* Add more routes as needed */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
