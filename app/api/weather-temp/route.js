import { NextResponse } from 'next/server';
import { getWeatherByPostalCode, getWeatherByCityName, getFallbackWeatherData } from '../../../lib/services/weatherService';

// Mark this route as dynamic (not static)
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const postalCode = searchParams.get('zip');
    
    // Check if API key is configured
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey || apiKey === 'demo_key_replace_with_real_key') {
      console.warn('OpenWeather API key not configured, using demo mode');
      const demoData = getFallbackWeatherData(postalCode || location || 'Unknown');
      demoData.description = `${demoData.description} (Demo Mode - API key needed for live data)`;
      return NextResponse.json(demoData);
    }
    
    let weatherData;
    
    // Prefer postal code if provided
    if (postalCode) {
      console.log('Fetching weather for postal code:', postalCode);
      weatherData = await getWeatherByPostalCode(postalCode, apiKey);
    } else if (location) {
      console.log('Fetching weather for location:', location);
      weatherData = await getWeatherByCityName(location, apiKey);
    } else {
      // Default to Toronto area
      console.log('Using default location: M4B 1B3');
      weatherData = await getWeatherByPostalCode('M4B 1B3', apiKey);
    }
    
    return NextResponse.json(weatherData);
    
  } catch (error) {
    console.error('Weather API error:', error);
    
    // Return fallback data with appropriate location
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const postalCode = searchParams.get('zip');
    
    const fallbackData = getFallbackWeatherData(postalCode || location || 'Unknown');
    
    // Add error context to description
    if (error.message.includes('401')) {
      fallbackData.description = `${fallbackData.description} (API key activation pending - please wait up to 2 hours)`;
    } else {
      fallbackData.description = `${fallbackData.description} (Weather service temporarily unavailable)`;
    }
    
    return NextResponse.json(fallbackData, { status: 200 });
  }
}