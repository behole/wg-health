// Helper functions for weather data

/**
 * Gets appropriate icon and color theme based on weather condition
 * Handles OpenWeatherMap API condition names 
 */
export const getWeatherTheme = (condition) => {
  if (!condition) return { icon: 'sun', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-300' };
  
  const conditionLower = condition.toLowerCase();
  
  // Clear weather
  if (conditionLower === 'clear' || conditionLower === 'sunny') {
    return { icon: 'sun', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-300' };
  }
  
  // Cloudy weather variations
  if (conditionLower === 'clouds' || conditionLower === 'cloudy') {
    return { icon: 'cloud', bgColor: 'bg-gray-100', borderColor: 'border-gray-300' };
  }
  
  if (conditionLower === 'partly cloudy' || conditionLower.includes('few clouds') || conditionLower.includes('scattered clouds')) {
    return { icon: 'partly_cloudy', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
  }
  
  // Rain variations
  if (conditionLower === 'rain' || conditionLower === 'rainy' || 
      conditionLower.includes('drizzle') || conditionLower.includes('shower')) {
    return { icon: 'rain', bgColor: 'bg-blue-100', borderColor: 'border-blue-300' };
  }
  
  // Thunderstorms
  if (conditionLower.includes('thunderstorm') || conditionLower === 'stormy') {
    return { icon: 'storm', bgColor: 'bg-gray-200', borderColor: 'border-gray-400' };
  }
  
  // Snow and similar
  if (conditionLower.includes('snow') || conditionLower === 'snowy' || 
      conditionLower.includes('sleet') || conditionLower.includes('hail')) {
    return { icon: 'snow', bgColor: 'bg-white', borderColor: 'border-blue-200' };
  }
  
  // Fog and similar
  if (conditionLower.includes('fog') || conditionLower === 'foggy' || 
      conditionLower.includes('mist') || conditionLower.includes('haze')) {
    return { icon: 'fog', bgColor: 'bg-gray-100', borderColor: 'border-gray-300' };
  }
  
  // Extreme conditions
  if (conditionLower.includes('tornado') || conditionLower.includes('hurricane') || 
      conditionLower.includes('extreme')) {
    return { icon: 'storm', bgColor: 'bg-red-100', borderColor: 'border-red-300' };
  }
  
  // Default to sunny if we can't determine
  return { icon: 'sun', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-300' };
};

/**
 * Helper function to get weather icon by name
 */
export const getWeatherIcon = (iconName) => {
  switch(iconName) {
    case 'sun': return '☀️';
    case 'partly_cloudy': return '⛅';
    case 'cloud': return '☁️';
    case 'rain': return '🌧️';
    case 'storm': return '⛈️';
    case 'snow': return '❄️';
    case 'fog': return '🌫️';
    default: return '☀️';
  }
};

/**
 * Helper function to convert Fahrenheit to Celsius
 */
export const fahrenheitToCelsius = (tempF) => {
  return Math.round((tempF - 32) * 5 / 9);
};

/**
 * Gets clothing recommendation based on temperature (in Celsius)
 */
export const getClothingSuggestion = (temp) => {
  if (!temp) return "Weather data unavailable. Dress for the season.";
  
  if (temp > 29) return "Wear light clothes and a hat - it's hot!"; // 85°F ≈ 29°C
  if (temp > 24) return "Perfect for short sleeves and light clothes."; // 75°F ≈ 24°C
  if (temp > 18) return "A light sweater or jacket might be nice."; // 65°F ≈ 18°C
  if (temp > 10) return "Dress warmly with a jacket."; // 50°F ≈ 10°C
  return "Bundle up with a coat, hat, and gloves!";
};

/**
 * Gets weather description for the day based on condition and temperature (in Celsius)
 */
export const getWeatherDescription = (condition, temp) => {
  if (!condition || !temp) return "Weather data unavailable.";
  
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('rain') || conditionLower.includes('storm')) {
    return "Remember to take an umbrella with you today!";
  }
  
  if (conditionLower.includes('snow')) {
    return "It's snowing! Roads might be slippery, so take care when walking or driving.";
  }
  
  if (temp > 29) {
    return "It's very hot today. Remember to stay hydrated and avoid prolonged sun exposure.";
  }
  
  if (temp < 0) {
    return "It's freezing cold today. Bundle up well and be careful of icy patches.";
  }
  
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
    return "It's a beautiful day! Perfect weather to spend some time outdoors.";
  }
  
  return "Enjoy your day, whatever the weather!";
};