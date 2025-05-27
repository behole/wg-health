'use client';

import React, { memo } from 'react';
import { WeatherData } from '@/types';
import { Card } from '@/components/ui';

interface WeatherCardProps {
  weather: WeatherData | null;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

const WeatherCard = memo<WeatherCardProps>(({ 
  weather, 
  loading = false, 
  error = null, 
  className = '' 
}) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return '☀️';
      case 'cloudy':
        return '☁️';
      case 'rainy':
        return '🌧️';
      case 'snowy':
        return '❄️';
      case 'partly cloudy':
        return '⛅';
      default:
        return '🌤️';
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 25) return 'text-red-600';
    if (temp >= 15) return 'text-orange-500';
    if (temp >= 5) return 'text-blue-500';
    return 'text-blue-700';
  };

  if (loading) {
    return (
      <Card className={`animate-pulse ${className}`} title="Weather">
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className} title="Weather">
        <div className="text-center py-4">
          <p className="text-red-600 text-sm mb-2">⚠️ Unable to load weather</p>
          <p className="text-gray-500 text-xs">{error}</p>
        </div>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className={className} title="Weather">
        <div className="text-center py-4">
          <p className="text-gray-500">No weather data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={className} title="Weather">
      <div className="text-center">
        {/* Weather Icon and Temperature */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          <span className="text-4xl" role="img" aria-label={weather.condition}>
            {getWeatherIcon(weather.condition)}
          </span>
          <div className="text-left">
            <div className={`text-3xl font-bold ${getTemperatureColor(weather.temperature)}`}>
              {weather.temperature}°C
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {weather.condition}
            </div>
          </div>
        </div>

        {/* Temperature Range */}
        <div className="flex justify-center space-x-4 mb-4 text-sm">
          <span className="text-gray-600">
            High: <span className="font-medium">{weather.highTemp}°C</span>
          </span>
          <span className="text-gray-600">
            Low: <span className="font-medium">{weather.lowTemp}°C</span>
          </span>
        </div>

        {/* Description */}
        {weather.description && (
          <p className="text-gray-700 text-sm mb-4 leading-relaxed">
            {weather.description}
          </p>
        )}

        {/* Additional Details */}
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between">
            <span>Humidity:</span>
            <span className="font-medium">{weather.humidity}%</span>
          </div>
          <div className="flex justify-between">
            <span>Wind:</span>
            <span className="font-medium">{weather.windSpeed} km/h</span>
          </div>
        </div>

        {/* Location and Last Updated */}
        <div className="mt-3 text-xs text-gray-500">
          <div>{weather.location}</div>
          {weather.lastUpdated && (
            <div>Updated: {new Date(weather.lastUpdated).toLocaleTimeString()}</div>
          )}
        </div>
      </div>
    </Card>
  );
});

WeatherCard.displayName = 'WeatherCard';

export default WeatherCard;