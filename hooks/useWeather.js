'use client';

import { useState, useEffect } from 'react';
import { getWeather, getWeatherByZip } from '../lib/api';

// Default postal code (should match the one in the API route)
const DEFAULT_POSTAL = 'M4B 1B3';

/**
 * Custom hook for fetching weather data
 * @param {string} postalCode - Postal code to get weather for (preferred method)
 * @param {string} location - Location name (legacy/fallback method)
 * @returns {Object} Weather data, loading state, and error if any
 */
const useWeather = (postalCode = DEFAULT_POSTAL, location = null) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        console.log('Fetching weather for postal code:', postalCode, 'location:', location);
        
        let data;
        // Prefer postal code if provided
        if (postalCode) {
          console.log('Using postal code:', postalCode);
          data = await getWeatherByZip(postalCode);
        } else if (location) {
          // Fall back to location name
          console.log('Using location:', location);
          data = await getWeather(location);
        } else {
          // Default to the default postal code
          console.log('Using default postal code:', DEFAULT_POSTAL);
          data = await getWeatherByZip(DEFAULT_POSTAL);
        }
        
        console.log('Weather data received:', data);
        setWeather(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError(err.message);
        
        // Set fallback weather data
        const fallbackData = {
          temperature: 22,
          condition: 'sunny',
          highTemp: 26,
          lowTemp: 18,
          description: 'Unable to fetch weather. Using default sunny day data.',
          location: location || `Postal Code: ${postalCode || DEFAULT_POSTAL}`,
          humidity: 50,
          windSpeed: 5
        };
        console.log('Setting fallback weather data:', fallbackData);
        setWeather(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh weather data every 30 minutes
    const intervalId = setInterval(fetchWeather, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [postalCode, location]);

  return { weather, loading, error };
};

export default useWeather;