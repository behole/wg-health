import { NextResponse } from 'next/server';
import weatherData from '../../../public/api/weather.json';

// For static export, we'll use pre-defined weather data
export async function GET() {
  // Return the static weather data from our JSON file
  return NextResponse.json({
    temperature: 72,
    condition: 'sunny',
    highTemp: 78,
    lowTemp: 65,
    description: 'Beautiful day today! Perfect weather to spend some time outdoors.',
    humidity: 45,
    windSpeed: 5,
    location: 'Oceanside',
  });
}