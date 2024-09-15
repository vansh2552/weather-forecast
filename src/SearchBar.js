import React, { useState } from 'react';

const SearchBar = ({ cities, onSearch }) => {
  const [query, setQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Handle input change and filter cities
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value) {
      const lowerCaseValue = value.toLowerCase();
      const filtered = Object.keys(cities).filter(city =>
        city.toLowerCase().includes(lowerCaseValue)
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(Object.keys(cities)); // Show all cities when input is empty
    }
  };

  // Handle city selection
  const handleCitySelect = (city) => {
    setQuery(city);
    setFilteredCities([]);
    setDropdownOpen(false); // Close dropdown after selection
    onSearch(city);
  };

  // Handle input focus
  const handleInputFocus = () => {
    setDropdownOpen(true);
    if (!query) {
      setFilteredCities(Object.keys(cities)); // Show all cities when input is focused
    }
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder="Search for a city..."
        style={styles.input}
      />
      {isDropdownOpen && filteredCities.length > 0 && (
        <ul style={styles.dropdown}>
          {filteredCities.map((city, index) => (
            <li
              key={index}
              onClick={() => handleCitySelect(city)}
              style={styles.item}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '300px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  dropdown: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    maxHeight: '150px',
    overflowY: 'auto',
    zIndex: 1,
  },
  item: {
    padding: '10px',
    cursor: 'pointer',
  },
};

export default SearchBar;
