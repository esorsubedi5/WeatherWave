import React, { useState } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Logout from './user/Logout'; // Import the Logout component

const NavbarComponent = ({ isLoggedIn, onLogout }) => {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">WeatherApp</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        
                    </Nav>
                    <Nav>
                        {!isLoggedIn ? (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Signup</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/user">Profile</Nav.Link>
                                {/* Use the Logout component */}
                                <Logout onLogout={onLogout} />
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
