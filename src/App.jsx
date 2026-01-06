import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = '8c8e1aa8685f30d9aa3d0d94a1c4b1e2';

  // Load default location on mount
  useEffect(() => {
    fetchWeatherByCoords();
  }, []);

  const fetchWeatherByCoords = async () => {
    setLoading(true);
    setError('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=metric`
            );
            
            if (!response.ok) throw new Error('Failed to fetch weather');
            
            const data = await response.json();
            setWeather(data);
          } catch (err) {
            // Fallback to default city
            fetchWeather('London');
          } finally {
            setLoading(false);
          }
        },
        () => {
          // Geolocation denied, use default city
          fetchWeather('London');
        }
      );
    } else {
      fetchWeather('London');
    }
  };

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  const getWeatherBackground = (main) => {
    const weatherType = main?.toLowerCase();
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 18;

    switch (weatherType) {
      case 'clear':
        return isNight ? 'clear-night' : 'clear-day';
      case 'clouds':
        return isNight ? 'cloudy-night' : 'cloudy-day';
      case 'rain':
      case 'drizzle':
        return 'rainy';
      case 'snow':
        return 'snowy';
      case 'thunderstorm':
        return 'stormy';
      case 'mist':
      case 'fog':
        return 'foggy';
      default:
        return 'clear-day';
    }
  };

  return (
    <div className={`app ${weather ? getWeatherBackground(weather.weather[0].main) : 'clear-day'}`}>
      <div className="weather-overlay"></div>
      
      <div className="container">
        <h1 className="app-title">Weather Now</h1>
        
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit" className="search-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            Search
          </button>
        </form>

        {loading && <div className="loading">Loading...</div>}
        
        {error && <div className="error">{error}</div>}

        {weather && !loading && (
          <div className="weather-card">
            <div className="weather-main">
              <h2 className="city-name">{weather.name}, {weather.sys.country}</h2>
              <div className="temperature">{Math.round(weather.main.temp)}°C</div>
              <div className="description">{weather.weather[0].description}</div>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <div className="detail-label">Feels Like</div>
                <div className="detail-value">{Math.round(weather.main.feels_like)}°C</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Humidity</div>
                <div className="detail-value">{weather.main.humidity}%</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Wind Speed</div>
                <div className="detail-value">{weather.wind.speed} m/s</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">Pressure</div>
                <div className="detail-value">{weather.main.pressure} hPa</div>
              </div>
            </div>

            <div className="temp-range">
              <div className="temp-item">
                <span className="temp-label">Min</span>
                <span className="temp-value">{Math.round(weather.main.temp_min)}°C</span>
              </div>
              <div className="temp-divider"></div>
              <div className="temp-item">
                <span className="temp-label">Max</span>
                <span className="temp-value">{Math.round(weather.main.temp_max)}°C</span>
              </div>
            </div>
          </div>
        )}

        {!weather && !loading && !error && (
          <div className="welcome-message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="welcome-icon">
              <path d="M12 2v10M12 22v-4M4.93 4.93l7.07 7.07M19.07 19.07l-3.54-3.54M2 12h10M22 12h-4M4.93 19.07l7.07-7.07M19.07 4.93l-3.54 3.54" />
            </svg>
            <p>Loading your location...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
