import React from 'react';

const CurrentTemperature = ({ city, day, temperature, weatherCondition, unit, highTemp, lowTemp }) => {
  return (
    <div style={styles.container}>
      <h1 style={styles.city}>{city}</h1>
      <h1 style={styles.temperature}>{temperature}°{unit}</h1>
      <p style={styles.highLow}>High: {highTemp}°{unit} | Low: {lowTemp}°{unit}</p>
      <p style={styles.day}>{day}</p>
      {weatherCondition.isRainy && <p style={styles.status}>🌧️ Rainy</p>}
      {weatherCondition.isWindy && <p style={styles.status}>💨 Windy</p>}
      {weatherCondition.isSunny && <p style={styles.status}>☀️ Sunny</p>}
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
  city: {
    fontSize: '30px',
    fontWeight: 'bold',
  },
  day: {
    fontSize: '18px',
    margin: '5px 0',
    color: '#555',
  },
  temperature: {
    fontSize: '48px',
    fontWeight: 'bold',
  },
  highLow: {
    fontSize: '16px',
    color: '#888',
  },
  label: {
    marginTop: '10px',
    fontSize: '18px',
    color: '#555',
  },
  status: {
    fontSize: '18px',
    color: '#555',
  },
};

export default CurrentTemperature;
