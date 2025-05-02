import { NextResponse } from 'next/server';

// OpenWeatherMap API key from environment variable
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Default zip code (can be updated later through user settings)
const DEFAULT_ZIP = '92054';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  // Accept both zip code or location name (for backward compatibility)
  const zipCode = searchParams.get('zip') || DEFAULT_ZIP;
  const location = searchParams.get('location');
  
  try {
    let url;
    
    if (zipCode) {
      // If zip is provided, use it (US zip codes by default)
      url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&units=imperial&appid=${WEATHER_API_KEY}`;
    } else if (location) {
      // Fallback to location name if zip is not provided
      url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${WEATHER_API_KEY}`;
    } else {
      // Default to the zip code if neither is provided
      url = `https://api.openweathermap.org/data/2.5/weather?zip=${DEFAULT_ZIP},us&units=imperial&appid=${WEATHER_API_KEY}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform OpenWeatherMap response to our app's format
    const weatherData = {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main.toLowerCase(),
      highTemp: Math.round(data.main.temp_max),
      lowTemp: Math.round(data.main.temp_min),
      description: getWeatherDescription(data.weather[0].main.toLowerCase(), Math.round(data.main.temp)),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      location: data.name,
      // Include raw data for debugging (can be removed in production)
      rawData: process.env.NODE_ENV === 'development' ? data : undefined
    };
    
    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    
    // Provide fallback data in case of API failure
    const fallbackData = {
      temperature: 72,
      condition: 'sunny',
      highTemp: 78,
      lowTemp: 65,
      description: 'Unable to fetch weather. Using default sunny day data.',
      location: location || `ZIP ${zipCode}`,
      error: error.message
    };
    
    return NextResponse.json(fallbackData, { status: 200 });
  }
}

// Helper function to get weather description
function getWeatherDescription(condition, temp) {
  if (!condition || !temp) return "Weather data unavailable.";
  
  if (condition.includes('rain') || condition.includes('drizzle')) {
    return "Remember to take an umbrella with you today!";
  }
  
  if (condition.includes('thunderstorm')) {
    return "Thunderstorms today! Stay indoors when possible and keep safe.";
  }
  
  if (condition.includes('snow')) {
    return "It's snowing! Roads might be slippery, so take care when walking or driving.";
  }
  
  if (temp > 85) {
    return "It's very hot today. Remember to stay hydrated and avoid prolonged sun exposure.";
  }
  
  if (temp < 32) {
    return "It's freezing cold today. Bundle up well and be careful of icy patches.";
  }
  
  if (condition.includes('clear')) {
    return "It's a beautiful day! Perfect weather to spend some time outdoors.";
  }
  
  if (condition.includes('cloud')) {
    return "A mix of sun and clouds today. Good weather for a walk outside.";
  }
  
  return "Enjoy your day, whatever the weather!";
}