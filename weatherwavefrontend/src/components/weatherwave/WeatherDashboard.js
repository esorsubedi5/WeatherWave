import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerHalf, faTemperatureHigh, faTint, faCloud } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';  // Import useLocation

const WeatherDashboard = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const cityFromQuery = queryParams.get('city') || 'Sydney';  // Default to Sydney if no city param

    const [city, setCity] = useState(cityFromQuery);
    const [weatherData, setWeatherData] = useState(null);
    const [lastValidWeatherData, setLastValidWeatherData] = useState(null);
    const [error, setError] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(0);

    useEffect(() => {
        if (!isTyping && city) {
            fetchWeatherData(city);
        }
    }, [isTyping, city]);

    const fetchWeatherData = async (city) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/weather/?city=${city}`);
            setWeatherData(response.data);
            setLastValidWeatherData(response.data);
            setError(null);
        } catch (error) {
            setWeatherData(null);
            setError('Could not fetch weather data. Please try again.');
        }
    };

    const handleCityChange = (e) => {
        setCity(e.target.value);
        setIsTyping(true);

        if (typingTimeout) clearTimeout(typingTimeout);

        const timeoutId = setTimeout(() => {
            setIsTyping(false);
        }, 1000);

        setTypingTimeout(timeoutId);
    };

    const toFahrenheit = (celsius) => (celsius * 9) / 5 + 32;

    return (
        <div className="weather-dashboard">
            <h2>Weather Dashboard</h2>
            <input
                type="text"
                value={city}
                onChange={handleCityChange}
                placeholder="Enter city name"
            />
            <button onClick={() => fetchWeatherData(city)}>Get Weather</button>

            {error && !isTyping && <p style={{ color: 'red' }}>{error}</p>}

            {lastValidWeatherData ? (
                <div>
                    <h3>Weather in {lastValidWeatherData.city}, {lastValidWeatherData.country}</h3>
                    <div className="weather-info">
                        {lastValidWeatherData.forecast.map((day, index) => (
                            <div key={index} className="weather-day">
                                <h4>{day.date}</h4>
                                <div className="weather-item">
                                    <FontAwesomeIcon icon={faThermometerHalf} /><small><em>Temperature: </em></small>{day.temp}C / {toFahrenheit(day.temp).toFixed(1)}F
                                </div>
                                <div className="weather-item">
                                    <FontAwesomeIcon icon={faTemperatureHigh} /> <small><em>Feels like: </em></small>{day.feels_like}C / {toFahrenheit(day.feels_like).toFixed(1)}F
                                </div>
                                <div className="weather-item">
                                    <FontAwesomeIcon icon={faTint} /> <small><em>Humidity: </em></small>{day.humidity}%
                                </div>
                                <div className="weather-item">
                                    <FontAwesomeIcon icon={faCloud} /> <small><em>Condition: </em></small>{day.condition}
                                </div>
                                <div className="weather-icon">
                                    <img
                                        src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                        alt={day.condition}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p>No weather data available.</p>
            )}
        </div>
    );
};

export default WeatherDashboard;
