import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axiosInstance from '../../../src/axiosInstance';
import debounce from 'lodash.debounce'; // Add lodash.debounce for debouncing API calls

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        confirm_email: '',
        mobile: '',
        first_name: '',
        last_name: '',
        password: '',
        confirm_password: '',
    });

    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [registrationErrors, setRegistrationErrors] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();

    // Debounced function to validate fields
    const validateField = debounce(async (fieldName, value) => {
        try {
            const response = await axiosInstance.post('account/register/', { [fieldName]: value });
            // Clear any existing error for this field
            setFieldErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
        } catch (error) {
            if (error.response && error.response.data) {
                setFieldErrors(prevErrors => ({
                    ...prevErrors,
                    [fieldName]: error.response.data[fieldName] ? error.response.data[fieldName][0] : ''
                }));
            }
        }
    }, 500); // Adjust debounce delay as needed

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Call the validation function for fields that need real-time validation
        if (['username', 'email', 'confirm_email', 'mobile', 'confirm_password'].includes(name)) {
            validateField(name, value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('account/register/', formData);
            console.log('User registered successfully:', response.data);
            setRegistrationSuccess(true);
        } catch (error) {
            console.error('Registration failed:', error);
            if (error.response) {
                setRegistrationErrors(error.response.data);
            } else {
                setRegistrationErrors({ general: 'No response from the server.' });
            }
        }
    };

    useEffect(() => {
        if (registrationSuccess) {
            const redirectTimer = setTimeout(() => {
                navigate('/login');
            }, 2000); // Redirect after 2 seconds

            return () => clearTimeout(redirectTimer); // Clean up the timer
        }
    }, [registrationSuccess, navigate]);

    return (
        <Container>
            {registrationSuccess ? (
                <Alert variant="success">
                    <p>Registration Successful! Redirecting to Login...</p>
                </Alert>
            ) : (
                <Container>
                    <h2>Registration Form</h2>
                    <Form onSubmit={handleSubmit}>
                        {Object.keys(formData).map((fieldName, index) => (
                            <Form.Group controlId={`form${fieldName}`} key={index}>
                                <Form.Label>
                                    {fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace('_', ' ')}
                                </Form.Label>
                                <Form.Control
                                    type={fieldName.includes('password') ? 'password' : 'text'}
                                    placeholder={`Enter ${fieldName.replace('_', ' ')}`}
                                    name={fieldName}
                                    value={formData[fieldName]}
                                    onChange={handleChange}
                                />
                                {fieldErrors[fieldName] && (
                                    <Alert variant="danger">
                                        <p>{fieldErrors[fieldName]}</p>
                                    </Alert>
                                )}
                            </Form.Group>
                        ))}

                        {registrationErrors.non_field_errors && (
                            <Alert variant="danger">
                                <ul>
                                    {registrationErrors.non_field_errors.map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </Alert>
                        )}
                        <Button variant="success" type="submit">
                            Register
                        </Button>
                    </Form>
                </Container>
            )}
        </Container>
    );
};

export default Register;
