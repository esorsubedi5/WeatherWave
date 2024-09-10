import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import axiosInstance from '../../src/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureHigh, faTint, faCloud } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [city, setCity] = useState('Sydney');
    const [weatherData, setWeatherData] = useState(null);
    const navigate = useNavigate();

    const fetchUserData = async () => {
        try {
            const response = await axiosInstance.get('account/me/', {
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`
                }
            });
            setUser(response.data);
        } catch (error) {
            navigate('/dashboard');
        }
    };

    const fetchWeatherData = async () => {
        try {
            const response = await axiosInstance.get(`api/weather/?city=${city}`);
            setWeatherData(response.data);
        } catch (error) {
            console.error('Failed to fetch weather data', error);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchWeatherData();
    }, [city]);

    const toFahrenheit = (celsius) => (celsius * 9) / 5 + 32;

    // Navigate to detailed forecast
    const goToDetailedForecast = () => {
        navigate(`/weatherdashboard?city=${city}`);  // Pass city as query param
    };

    return (
        <Container>
            {user && user.first_name ? (
                <h2>Hi, {user.first_name}!</h2>
            ) : (
                <h2>Hi, How you Doin'?</h2>
            )}
            <h1>Weather Dashboard</h1>
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
            />
            <Button variant="primary" onClick={fetchWeatherData}>Update Weather</Button>


            {weatherData && (
                <>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>{weatherData.city}, {weatherData.country}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                                {weatherData.forecast[0].condition}
                            </Card.Subtitle>
                            <Card.Text>
                                <h2>{weatherData.forecast[0].temp}C / {toFahrenheit(weatherData.forecast[0].temp).toFixed(1)}F</h2>
                            </Card.Text>
                            <div>
                                <FontAwesomeIcon icon={faTemperatureHigh} /> Feels like: {weatherData.forecast[0].feels_like}C / {toFahrenheit(weatherData.forecast[0].feels_like).toFixed(1)}F
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faTint} /> Humidity: {weatherData.forecast[0].humidity}%
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faCloud} /> Condition: {weatherData.forecast[0].condition}
                            </div>
                            {weatherData.forecast[0].icon && (
                                <img
                                    src={`http://openweathermap.org/img/wn/${weatherData.forecast[0].icon}@2x.png`}
                                    alt={weatherData.forecast[0].condition}
                                />
                            )}
                        </Card.Body>
                    </Card>

                    {/* Next 3 Days' Weather */}
                    <Row>
                        {weatherData.forecast.slice(1, 4).map((day, index) => (
                            <Col key={index} sm={4} className="mb-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{new Date(day.date).toDateString()}</Card.Title>
                                        <Card.Text>
                                            {day.temp}C / {toFahrenheit(day.temp).toFixed(1)}F
                                        </Card.Text>
                                        <div>
                                            <FontAwesomeIcon icon={faCloud} /> {day.condition}
                                        </div>
                                        {day.icon && (
                                            <img
                                                src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                                alt={day.condition}
                                            />
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Button variant="secondary" onClick={goToDetailedForecast}>Get Detailed Forecast</Button>
                </>
            )}
        </Container>
    );
};

export default Dashboard;
