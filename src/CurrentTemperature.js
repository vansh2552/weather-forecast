import React from 'react';

const CurrentTemperature = ({ temperature, weatherCondition, unit }) => {
  return (
    <div style={styles.container}>
      <h1 style={styles.temperature}>{temperature}°{unit}</h1>
      <p style={styles.label}>Current Temperature</p>
      {weatherCondition.isRainy && <p style={styles.status}>🌧️ Rainy</p>}
      {weatherCondition.isWindy && <p style={styles.status}>💨 Windy</p>}
    </div>
  );
};
export default CurrentTemperature;

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
  temperature: {
    fontSize: '48px',
    fontWeight: 'bold',
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