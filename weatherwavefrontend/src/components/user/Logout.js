// src/components/user/Logout.js

import React from 'react';

const Logout = ({ onLogout }) => {
    const handleLogout = () => {
        if (window.confirm('Do you want to logout?')) {
            onLogout();
        }
    };

    return (
        <button className="btn btn-link" onClick={handleLogout}>
            Logout
        </button>
    );
};

export default Logout;
