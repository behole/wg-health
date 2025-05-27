import { NextResponse } from 'next/server';

// For static export, we'll use pre-defined weather data
export async function GET() {
  // Since this is a static export, we can't use request.url
  // Return static weather data for the default postal code M4B 1B3
  const weatherData = {
    temperature: 22,
    condition: 'sunny',
    highTemp: 26,
    lowTemp: 18,
    description: 'Beautiful day today! Perfect weather to spend some time outdoors.',
    humidity: 45,
    windSpeed: 8,
    location: 'Toronto, ON (M4B 1B3)'
  };
  
  return NextResponse.json(weatherData);
}