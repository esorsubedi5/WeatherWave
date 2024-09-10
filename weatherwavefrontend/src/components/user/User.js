import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form } from 'react-bootstrap';
import axiosInstance from '../../../src/axiosInstance';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedData, setEditedData] = useState({
        username: '',
        email: '',
        mobile: '',
        first_name: '',
        last_name: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get('/account/me/', {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`,
                    },
                });
                setUserData(response.data);
                setEditedData(response.data);
            } catch (error) {
                setError('No user details found.');
                navigate('/login');
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleSaveClick = async () => {
        try {
            await axiosInstance.put(
                '/account/me/',
                editedData,
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const response = await axiosInstance.get('/account/me/', {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`,
                },
            });
            setUserData(response.data);
            setEditMode(false);
        } catch (error) {
            setError('Error updating user details.');
        }
    };

    const handleDeleteClick = async () => {
        try {
            await axiosInstance.delete('/account/delete/', {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`,
                },
            });
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            // Extract the error message from the response
            if (error.response && error.response.data && error.response.data.detail) {
                setError(error.response.data.detail);
            } else {
                setError('Error deleting account.');
            }
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <Container>
            <h2>User Profile</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {userData && (
                <Card>
                    <Card.Body>
                        {editMode ? (
                            <Form>
                                <Form.Group controlId="formUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Username"
                                        name="username"
                                        value={editedData.username}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        name="email"
                                        value={editedData.email}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formMobile">
                                    <Form.Label>Mobile</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter mobile"
                                        name="mobile"
                                        value={editedData.mobile}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formFirstName">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter first name"
                                        name="first_name"
                                        value={editedData.first_name}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter last name"
                                        name="last_name"
                                        value={editedData.last_name}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Form>
                        ) : (
                            <>
                                <Card.Title>{userData.username}</Card.Title>
                                <Card.Text>
                                    <strong>Email:</strong> {userData.email}
                                    <br />
                                    <strong>Mobile:</strong> {userData.mobile}
                                    <br />
                                    <strong>First Name:</strong> {userData.first_name}
                                    <br />
                                    <strong>Last Name:</strong> {userData.last_name}
                                </Card.Text>
                            </>
                        )}

                        {editMode ? (
                            <Button variant="primary" onClick={handleSaveClick}>
                                Save
                            </Button>
                        ) : (
                            <Button variant="primary" onClick={handleEditClick}>
                                Edit Profile
                            </Button>
                        )}

                        {!userData.is_superuser && (
                            <Button variant="danger" onClick={handleDeleteClick} style={{ marginLeft: '10px' }}>
                                Delete Account
                            </Button>
                        )}
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default UserProfile;
