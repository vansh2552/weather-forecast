// TemperatureToggle.js
import React from 'react';
import './TemperatureToggle.css';

const TemperatureToggle = ({ isCelsius, toggleUnit }) => {
  return (
    <div className="toggle-container" onClick={toggleUnit}>
      <div className={`toggle-cylinder ${isCelsius ? 'left' : 'right'}`}>
        <div className="toggle-labels">
          <span className={`label ${isCelsius ? 'active' : ''}`}>°C</span>
          <span className={`label ${!isCelsius ? 'active' : ''}`}>°F</span>
        </div>
        <div className="toggle-ball"></div>
      </div>
    </div>
  );
};

export default TemperatureToggle;
