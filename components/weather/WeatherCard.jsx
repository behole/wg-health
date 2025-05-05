'use client';

import React from 'react';
import useWeather from '../../hooks/useWeather';
import { getWeatherTheme, getClothingSuggestion, getWeatherIcon } from '../../lib/weather';

// Default zip code - can be changed in user settings
const DEFAULT_ZIP = '92054';

const WeatherCard = ({ location, zipCode = DEFAULT_ZIP }) => {
  // Priority: 1. zipCode (if provided), 2. location (legacy/fallback)
  const { weather: weatherData, loading, error } = useWeather(zipCode, location);
  
  // Show loading state
  if (loading && !weatherData) {
    return (
      <div className="bg-gray-100 border-2 border-gray-200 rounded-xl p-4 mb-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-3"></div>
        <div className="h-16 bg-gray-200 rounded mb-2"></div>
        <div className="h-6 bg-gray-200 rounded"></div>
      </div>
    );
  }
  
  // Show error state or fallback
  if (error && !weatherData) {
    return (
      <div className="bg-red-100 border-2 border-red-300 rounded-xl p-4 mb-6">
        <h2 className="text-2xl font-bold mb-2">Weather Unavailable</h2>
        <p>{error}</p>
      </div>
    );
  }
  
  // If we have no data yet, don't render anything
  if (!weatherData) return null;
  
  const theme = getWeatherTheme(weatherData.condition);
  
  return (
    <div className={`${theme.bgColor} border-2 ${theme.borderColor} rounded-xl p-4 mb-6`}>
      {/* Weather header with icon */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-2xl font-bold">Today's Weather</h2>
          {weatherData.location && (
            <p className="text-sm font-medium">{weatherData.location}</p>
          )}
        </div>
        <span className="text-4xl">{getWeatherIcon(theme.icon)}</span>
      </div>
      
      {/* Temperature and condition */}
      <div className="flex items-baseline mb-2">
        <span className="text-3xl font-bold mr-2">{weatherData.temperature}°</span>
        <span className="capitalize text-lg">{weatherData.condition}</span>
      </div>
      
      {/* High/Low temperatures and additional data */}
      <p className="text-lg mb-3">
        High: {weatherData.highTemp}° • Low: {weatherData.lowTemp}°
        {weatherData.humidity && (
          <span className="block text-sm mt-1">Humidity: {weatherData.humidity}%</span>
        )}
        {weatherData.windSpeed && (
          <span className="block text-sm">Wind: {weatherData.windSpeed} mph</span>
        )}
      </p>
      
      {/* Clothing suggestion */}
      <div className="bg-white bg-opacity-70 rounded-lg p-3 mb-2">
        <p className="text-lg font-medium">{getClothingSuggestion(weatherData.temperature)}</p>
      </div>
      
      {/* Weather description */}
      <p className="text-sm">{weatherData.description}</p>
    </div>
  );
};

export default WeatherCard;
