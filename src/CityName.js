import React from 'react';

const CityName = ({ name }) => {
  return (
    <div style={styles.container}>
      <h2>{name}</h2>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '10px',
  },
};

export default CityName;
