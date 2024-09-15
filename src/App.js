import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import CurrentTemperature from './CurrentTemperature';
import HourlyWeather from './HourlyTemperatures';
import cities from './cities.json';
import './App.css';
import TemperatureToggle from './TemperatureToggle'; 

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
      const fiveHoursLater = new Date(now.getTime() + 5 * 60 * 60 * 1000);
      const endDateTime = fiveHoursLater.toISOString().split('.')[0] + 'Z';
  
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
  
      setCurrentWeather({
        temperature: currentTemp.value,
        weatherCondition: {
          isRainy: nextFiveHoursPrecip.some(p => p.value > 0.5),
          isWindy: nextFiveHoursWind.some(w => w.value > 8),
        },
        highTemp,
        lowTemp,
        city, // Ensure the city name is set properly
        day: getDayOfWeek(currentTemp.date) // Get the day of the week
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
      city={currentWeather.city} // Display the city name
      day={currentWeather.day} // Display the day of the week
      temperature={currentWeather.temperature}
      weatherCondition={currentWeather.weatherCondition}
      unit={isCelsius ? 'C' : 'F'}
      highTemp={currentWeather.highTemp} // High temperature
      lowTemp={currentWeather.lowTemp} // Low temperature
    />
    <HourlyWeather
      temperatures={hourlyWeather}
      unit={isCelsius ? 'C' : 'F'}
    />
  </div>
)}
    </div>
  );
};

export default App;
