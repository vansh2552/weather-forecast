import React from 'react';

const HourlyWeather = ({ temperatures = [], precipitations = [], winds = [], unit }) => {
  return (
    <div style={styles.container}>
      <h2>Hourly Temperatures</h2>
      <div style={styles.list}>
        {temperatures.length > 0 ? (
          temperatures.map((temp, index) => (
            <div key={index} style={styles.card}>
              <p style={styles.time}>{new Date(temp.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p style={styles.temp}>{temp.value}°{unit}</p>

              {precipitations[index] > 0.5 ? (
                <p style={styles.status}>🌧️ Rainy</p>
              ) : winds[index] > 8 ? (
                <p style={styles.status}>💨 Windy</p>
              ) : (
                <p style={styles.status}>☀️ Sunny</p>
              )}
            </div>
          ))
        ) : (
          <p>No hourly data available.</p>
        )}
      </div>
    </div>
  );
};


const styles = {
  container: {
    padding: '20px',
  },
  list: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap', // Allows wrapping if needed
  },
  card: {
    padding: '10px',
    textAlign: 'center',
    width: '100px',
  },
  time: {
    fontSize: '16px',
    color: '#333',
  },
  temp: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  status: {
    fontSize: '16px',
    color: '#555',
  },
};


export default HourlyWeather;