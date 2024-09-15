import React from 'react';

const ForecastCard = ({ day, date, highTemp, lowTemp, unit, weatherCondition }) => {
    return (
      <div className="forecast-card">
        <h3>{day}</h3>
        <p>{date}</p>
        <p>{highTemp}°{unit} | {lowTemp}°{unit}</p>
        <p>
        {weatherCondition.isSunny ? '☀️ Sunny' : weatherCondition.isRainy ? '🌧️ Rainy' : weatherCondition.isWindy ? '💨 Windy' : 'Unknown'}
        </p>
      </div>
    );
  };
  

export default ForecastCard;
