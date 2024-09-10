// src/components/user/Login.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../src/axiosInstance';

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [loginError, setLoginError] = useState(null);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/account/', formData);

            // Handle successful login
            console.log('User logged in successfully', response.data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data in localStorage
            setLoginSuccess(true);
            onLogin(response.data.user); // Call onLogin with the user data
        } catch (error) {
            console.error('Login failed:', error);
            setLoginError('Invalid credentials. Please try again.');
        }
    };

    useEffect(() => {
        if (loginSuccess) {
            const redirectTimer = setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

            return () => clearTimeout(redirectTimer);
        }
    }, [loginSuccess, navigate]);

    return (
        <div>
            {loginSuccess ? (
                <p>Login Successful! Redirecting to UserDashboard...</p>
            ) : (
                <>
                    <h2>Login</h2>
                    {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </>
            )}
        </div>
    );
};

export default Login;
