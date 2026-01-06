import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = '16b3458051282777e4706598453694d0';

  // Load default location on mount
  useEffect(() => {
    fetchWeather('London');
  }, []);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`
      );
      
      const data = await response.json();
      
      if (response.ok && data.cod === 200) {
        setWeather(data);
        setError('');
      } else if (data.cod === 401) {
        throw new Error('API key is activating. Please wait 2 hours after key generation.');
      } else {
        throw new Error(data.message || 'City not found');
      }
    } catch (err) {
      setError(err.message || `Unable to find weather for "${cityName}".`);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city.trim());
      setCity('');
    }
  };

  const getWeatherType = () => {
    if (!weather) return 'clear-day';
    const main = weather.weather[0].main.toLowerCase();
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 18;

    switch (main) {
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
      case 'haze':
        return 'foggy';
      default:
        return 'clear-day';
    }
  };

  const weatherType = getWeatherType();

  return (
    <div className={`app ${weatherType}`}>
      {/* Weather Animations */}
      <div className="weather-animation">
        {weatherType === 'clear-day' && (
          <div className="sun">
            <div className="sun-core"></div>
            {[...Array(12)].map((_, i) => (
              <div key={i} className="sun-ray" style={{ transform: `rotate(${i * 30}deg)` }}></div>
            ))}
          </div>
        )}
        
        {weatherType === 'clear-night' && (
          <div className="moon"></div>
        )}
        
        {weatherType === 'rainy' && (
          <div className="rain">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="raindrop"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`
                }}
              ></div>
            ))}
          </div>
        )}
        
        {weatherType === 'snowy' && (
          <div className="snow">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="snowflake"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 5}s`,
                  fontSize: `${10 + Math.random() * 10}px`
                }}
              >
                ❄
              </div>
            ))}
          </div>
        )}
        
        {(weatherType === 'cloudy-day' || weatherType === 'cloudy-night') && (
          <div className="clouds">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="cloud"
                style={{
                  top: `${10 + i * 15}%`,
                  animationDelay: `${i * 2}s`,
                  animationDuration: `${20 + i * 5}s`
                }}
              ></div>
            ))}
          </div>
        )}
        
        {weatherType === 'stormy' && (
          <>
            <div className="storm-clouds"></div>
            <div className="lightning"></div>
          </>
        )}
      </div>

      <div className="container">
        <h1 className="app-title">Weather Now</h1>
        
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Enter city name (e.g., London, Paris, Tokyo, Mumbai)..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit" className="search-btn" disabled={loading}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

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
                <div className="detail-value">{Math.round(weather.wind.speed * 3.6)} km/h</div>
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
            <p>Loading weather data...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
