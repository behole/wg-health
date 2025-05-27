/**
 * Weather Service - OpenWeatherMap API integration
 */

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OPENWEATHER_GEO_URL = 'https://api.openweathermap.org/geo/1.0';

/**
 * Get weather data by geographic coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} apiKey - OpenWeatherMap API key
 * @returns {Promise<Object>} - Formatted weather data
 */
async function getWeatherByCoords(lat, lon, apiKey) {
  const url = `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  return {
    temperature: Math.round(data.main.temp),
    condition: data.weather[0].main.toLowerCase(),
    highTemp: Math.round(data.main.temp_max),
    lowTemp: Math.round(data.main.temp_min),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
    location: `${data.name}, ${data.sys.country}`,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Get coordinates by postal code (for Canadian postal codes)
 * @param {string} postalCode - Canadian postal code
 * @param {string} apiKey - OpenWeatherMap API key
 * @returns {Promise<{lat: number, lon: number}>} - Coordinates
 */
async function getCoordsByPostalCode(postalCode, apiKey) {
  // Remove spaces and convert to uppercase for Canadian postal codes
  const cleanPostalCode = postalCode.replace(/\s+/g, '').toUpperCase();
  
  const url = `${OPENWEATHER_GEO_URL}/zip?zip=${cleanPostalCode},CA&appid=${apiKey}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return {
    lat: data.lat,
    lon: data.lon,
    name: data.name
  };
}

/**
 * Get coordinates by city name
 * @param {string} cityName - City name
 * @param {string} apiKey - OpenWeatherMap API key
 * @returns {Promise<{lat: number, lon: number}>} - Coordinates
 */
async function getCoordsByCityName(cityName, apiKey) {
  const url = `${OPENWEATHER_GEO_URL}/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  if (data.length === 0) {
    throw new Error(`Location not found: ${cityName}`);
  }
  
  return {
    lat: data[0].lat,
    lon: data[0].lon,
    name: data[0].name
  };
}

/**
 * Get weather by postal code
 * @param {string} postalCode - Postal code
 * @param {string} apiKey - OpenWeatherMap API key
 * @returns {Promise<Object>} - Weather data
 */
export async function getWeatherByPostalCode(postalCode, apiKey) {
  try {
    const coords = await getCoordsByPostalCode(postalCode, apiKey);
    return await getWeatherByCoords(coords.lat, coords.lon, apiKey);
  } catch (error) {
    console.error('Error getting weather by postal code:', error);
    throw error;
  }
}

/**
 * Get weather by city name
 * @param {string} cityName - City name
 * @param {string} apiKey - OpenWeatherMap API key
 * @returns {Promise<Object>} - Weather data
 */
export async function getWeatherByCityName(cityName, apiKey) {
  try {
    const coords = await getCoordsByCityName(cityName, apiKey);
    return await getWeatherByCoords(coords.lat, coords.lon, apiKey);
  } catch (error) {
    console.error('Error getting weather by city name:', error);
    throw error;
  }
}

/**
 * Get fallback weather data when API calls fail
 * @param {string} location - Location identifier
 * @returns {Object} - Fallback weather data
 */
export function getFallbackWeatherData(location = 'Unknown') {
  // Create different weather based on location for demo purposes
  const weatherVariations = {
    'M4B 1B3': {
      temperature: 22,
      condition: 'sunny',
      highTemp: 26,
      lowTemp: 18,
      description: 'Beautiful sunny day in Toronto! Perfect for outdoor activities.',
      humidity: 45,
      windSpeed: 8,
      location: 'Toronto, ON (M4B 1B3)'
    },
    'K1A 0A9': {
      temperature: 19,
      condition: 'partly cloudy',
      highTemp: 23,
      lowTemp: 15,
      description: 'Partly cloudy day in Ottawa. Light sweater weather.',
      humidity: 55,
      windSpeed: 12,
      location: 'Ottawa, ON (K1A 0A9)'
    },
    'V6B 1A1': {
      temperature: 16,
      condition: 'cloudy',
      highTemp: 19,
      lowTemp: 13,
      description: 'Overcast skies in Vancouver. Might see some light drizzle.',
      humidity: 70,
      windSpeed: 6,
      location: 'Vancouver, BC (V6B 1A1)'
    },
    'T2P 0A8': {
      temperature: 25,
      condition: 'sunny',
      highTemp: 29,
      lowTemp: 18,
      description: 'Warm and sunny day in Calgary. Great weather for the mountains!',
      humidity: 35,
      windSpeed: 10,
      location: 'Calgary, AB (T2P 0A8)'
    }
  };

  // Clean the location input to match our demo data
  const cleanLocation = location.replace(/\s+/g, ' ').trim().toUpperCase();
  
  // Look for matching postal code pattern
  const matchedLocation = Object.keys(weatherVariations).find(key => 
    cleanLocation.includes(key.replace(/\s+/g, '')) || 
    cleanLocation.includes(key) ||
    key.replace(/\s+/g, '').includes(cleanLocation.replace(/\s+/g, ''))
  );

  const baseWeather = matchedLocation ? weatherVariations[matchedLocation] : {
    temperature: 22,
    condition: 'sunny',
    highTemp: 26,
    lowTemp: 18,
    description: 'Weather data temporarily unavailable. Showing pleasant forecast.',
    humidity: 50,
    windSpeed: 8,
    location: location
  };

  return {
    ...baseWeather,
    lastUpdated: new Date().toISOString()
  };
}