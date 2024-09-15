import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import CurrentTemperature from './CurrentTemperature';
import HourlyWeather from './HourlyTemperatures';
import cities from './cities.json';
import './App.css';
import TemperatureToggle from './TemperatureToggle'; 
import ForecastCard from './ForecastCard';


const App = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyWeather, setHourlyWeather] = useState([]);
  const [error, setError] = useState('');
  const [isCelsius, setIsCelsius] = useState(true); // State to toggle between Celsius and Fahrenheit
  const defaultCity = Object.keys(cities)[0];

  // Conversion helper functions
  const celsiusToFahrenheit = (celsius) => (celsius * 9 / 5) + 32;
  const fahrenheitToCelsius = (fahrenheit) => (fahrenheit - 32) * 5 / 9;

  // Fetch the weather data for a given city (using its coordinates)
  const fetchWeather = async (lat, lon, city) => {
    try {
      const now = new Date();
      const startDateTime = now.toISOString().split('.')[0] + 'Z';
      const fiveDaysLater = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days later
      const endDateTime = fiveDaysLater.toISOString().split('.')[0] + 'Z';
  
      const url = `https://api.meteomatics.com/${startDateTime}--${endDateTime}:PT1H/t_2m:C,precip_1h:mm,wind_speed_10m:ms/${lat},${lon}/json`;
  
      const response = await axios.get(url, {
        auth: {
          username: 'onebanc_gandhi_vansh',
          password: '7TSiH7sz8k',
        },
      });
  
      const temperatureData = response.data.data.find(item => item.parameter === 't_2m:C').coordinates[0].dates;
      const precipData = response.data.data.find(item => item.parameter === 'precip_1h:mm').coordinates[0].dates;
      const windData = response.data.data.find(item => item.parameter === 'wind_speed_10m:ms').coordinates[0].dates;
  
      const currentTemp = temperatureData[0];
      const nextFiveHoursTemps = temperatureData.slice(1, 6);
      const nextFiveHoursPrecip = precipData.slice(1, 6);
      const nextFiveHoursWind = windData.slice(1, 6);
  
      const highTemp = Math.max(...temperatureData.map(t => t.value));
      const lowTemp = Math.min(...temperatureData.map(t => t.value));
  
      // Map daily temperatures for forecast
      const dailyTemps = {};
      temperatureData.forEach(entry => {
        const date = new Date(entry.date);
        const day = date.toISOString().split('T')[0]; // Extract the date (YYYY-MM-DD)
        if (!dailyTemps[day]) dailyTemps[day] = [];
        dailyTemps[day].push(entry.value);
      });
  
      // Create forecast including both date and day of the week
      const forecast = Object.keys(dailyTemps).map(day => {
        const temps = dailyTemps[day];
        const date = new Date(day); // Create a date object from the day string
        const isRainy = precipData.some(p => p.date.split('T')[0] === day && p.value > 0.5);
        const isWindy = windData.some(w => w.date.split('T')[0] === day && w.value > 8);
        const isSunny = !isRainy && !isWindy;
  
        return {
          day: getDayOfWeek(date), // Get the day of the week (e.g., Monday)
          date: day, // Actual date (YYYY-MM-DD)
          high: Math.max(...temps),
          low: Math.min(...temps),
          weatherCondition: {
            isRainy,
            isWindy,
            isSunny
          }
        };
      });
  
      setCurrentWeather({
        temperature: currentTemp.value,
        weatherCondition: {
          isRainy: nextFiveHoursPrecip.some(p => p.value > 0.5),
          isWindy: nextFiveHoursWind.some(w => w.value > 8),
          isSunny: !nextFiveHoursPrecip.some(p => p.value > 0.5) && !nextFiveHoursWind.some(w => w.value > 8),
        },
        highTemp,
        lowTemp,
        city, // Ensure the city name is set properly
        day: getDayOfWeek(currentTemp.date), // Get the day of the week
        forecast: forecast.slice(0, 5), // Show forecast for next 5 days
      });
      setHourlyWeather(nextFiveHoursTemps);
      setError('');
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to fetch weather data.');
    }
  };
  
  
  const getDayOfWeek = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(date).getDay()];
  };

  // Handle city search from the dropdown
  const handleCitySearch = (city) => {
    const cityData = cities[city];
    if (cityData) {
      const { lat, lon } = cityData;
      fetchWeather(lat, lon, city);  // Pass the city name here
    } else {
      setError('City not found');
      setCurrentWeather(null);
      setHourlyWeather([]);
    }
  };
  

  // Handle temperature conversion
  const convertTemperatures = (isToCelsius) => {
  if (!currentWeather) return;

  const updatedCurrentWeather = {
    ...currentWeather,
    temperature: isToCelsius
      ? fahrenheitToCelsius(currentWeather.temperature).toFixed(1)
      : celsiusToFahrenheit(currentWeather.temperature).toFixed(1),
    highTemp: isToCelsius
      ? fahrenheitToCelsius(currentWeather.highTemp).toFixed(1)
      : celsiusToFahrenheit(currentWeather.highTemp).toFixed(1),
    lowTemp: isToCelsius
      ? fahrenheitToCelsius(currentWeather.lowTemp).toFixed(1)
      : celsiusToFahrenheit(currentWeather.lowTemp).toFixed(1),
  };

  const updatedHourlyWeather = hourlyWeather.map((hour) => ({
    ...hour,
    value: isToCelsius
      ? fahrenheitToCelsius(hour.value).toFixed(1)
      : celsiusToFahrenheit(hour.value).toFixed(1),
  }));

  setCurrentWeather(updatedCurrentWeather);
  setHourlyWeather(updatedHourlyWeather);
};

  // Toggle temperature unit
  const toggleTemperatureUnit = () => {
    setIsCelsius((prevIsCelsius) => {
      const newIsCelsius = !prevIsCelsius;
      convertTemperatures(newIsCelsius); // Convert temperatures
      return newIsCelsius;
    });
  };

  // Fetch the default city's weather when the component first loads
  useEffect(() => {
    const cityData = cities[defaultCity];
    if (cityData) {
      const { lat, lon } = cityData;
      fetchWeather(lat, lon, defaultCity); // Pass the city name to fetchWeather
    }
  }, [defaultCity]);

  return (
    <div>
      {/* Toggle Button for Celsius/Fahrenheit */}
       <TemperatureToggle isCelsius={isCelsius} toggleUnit={toggleTemperatureUnit} />

      {/* Search Bar */}
      <div className="search-bar">
        <SearchBar cities={cities} onSearch={handleCitySearch} />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Current and Hourly Weather Display */}
      {currentWeather && (
  <div>
    <CurrentTemperature
  city={currentWeather.city}
  day={currentWeather.day}
  temperature={currentWeather.temperature}
  weatherCondition={{
    isRainy: currentWeather.weatherCondition.isRainy,
    isWindy: currentWeather.weatherCondition.isWindy,
    isSunny: currentWeather.weatherCondition.isSunny // Pass sunny condition
  }}
  unit={isCelsius ? 'C' : 'F'}
  highTemp={currentWeather.highTemp}
  lowTemp={currentWeather.lowTemp}
/>
    <HourlyWeather
      temperatures={hourlyWeather}
      unit={isCelsius ? 'C' : 'F'}
    />
  </div>)}
  <h2>Five-Day Forecast</h2>
  {currentWeather && currentWeather.forecast && (
  <div className="forecast-container">
    {currentWeather.forecast.map((dayForecast, index) => (
      <ForecastCard
        key={index}
        day={dayForecast.day}
        date={dayForecast.date}
        highTemp={isCelsius ? dayForecast.high : celsiusToFahrenheit(dayForecast.high).toFixed(1)}
        lowTemp={isCelsius ? dayForecast.low : celsiusToFahrenheit(dayForecast.low).toFixed(1)}
        unit={isCelsius ? 'C' : 'F'}
        weatherCondition={dayForecast.weatherCondition}
      />
    ))}
  </div>
)}
    </div>
  );
};

export default App;
