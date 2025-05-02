'use client';

import { useState, useEffect } from 'react';
import { getWeather, getWeatherByZip } from '../lib/api';

// Default zip code (should match the one in the API route)
const DEFAULT_ZIP = '92054';

/**
 * Custom hook for fetching weather data
 * @param {string} zipCode - Zip code to get weather for (preferred method)
 * @param {string} location - Location name (legacy/fallback method)
 * @returns {Object} Weather data, loading state, and error if any
 */
const useWeather = (zipCode = DEFAULT_ZIP, location = null) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        
        let data;
        // Prefer zip code if provided
        if (zipCode) {
          data = await getWeatherByZip(zipCode);
        } else if (location) {
          // Fall back to location name
          data = await getWeather(location);
        } else {
          // Default to the default zip
          data = await getWeatherByZip(DEFAULT_ZIP);
        }
        
        setWeather(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError(err.message);
        
        // API should return fallback data, but just in case
        if (!weather) {
          setWeather({
            temperature: 72,
            condition: 'sunny',
            highTemp: 78,
            lowTemp: 65,
            description: 'Unable to fetch weather. Using default sunny day data.',
            location: location || `ZIP ${zipCode || DEFAULT_ZIP}`
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh weather data every 30 minutes
    const intervalId = setInterval(fetchWeather, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [zipCode, location]);

  return { weather, loading, error };
};

export default useWeather;