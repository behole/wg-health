/**
 * API helper functions for making requests to various endpoints
 */

/**
 * Generic API fetcher with error handling
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - The response data
 */
export async function fetchAPI(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Fetch weather data for a specific location by name
 * @param {string} location - The location name to get weather for
 * @returns {Promise<Object>} - Weather data
 */
export async function getWeather(location = 'Chicago') {
  return fetchAPI(
    `/api/weather-temp?location=${encodeURIComponent(location)}`
  );
}

/**
 * Fetch weather data for a specific postal code
 * @param {string} postalCode - The postal code to get weather for
 * @returns {Promise<Object>} - Weather data
 */
export async function getWeatherByZip(postalCode = 'M4B 1B3') {
  return fetchAPI(
    `/api/weather-temp?zip=${encodeURIComponent(postalCode)}`
  );
}

/**
 * Add a new appointment to the calendar
 * @param {Object} appointment - The appointment data
 * @returns {Promise<Object>} - The created appointment
 */
export async function addAppointment(appointment) {
  return fetchAPI('/api/calendar', {
    method: 'POST',
    body: JSON.stringify(appointment),
  });
}

/**
 * Get all appointments
 * @returns {Promise<Array>} - List of appointments
 */
export async function getAppointments() {
  return fetchAPI('/api/calendar');
}

/**
 * Add a note
 * @param {Object} note - The note data
 * @returns {Promise<Object>} - The created note
 */
export async function addNote(note) {
  return fetchAPI('/api/notes', {
    method: 'POST',
    body: JSON.stringify(note),
  });
}

/**
 * Get all notes
 * @returns {Promise<Array>} - List of notes
 */
export async function getNotes() {
  return fetchAPI('/api/notes');
}

/**
 * Upload a photo
 * @param {FormData} formData - Form data with photo
 * @returns {Promise<Object>} - The uploaded photo metadata
 */
export async function uploadPhoto(formData) {
  return fetch('/api/photos', {
    method: 'POST',
    body: formData,
    // Don't set Content-Type header as the browser will set it with the boundary
  }).then(response => {
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  });
}

/**
 * Get all photos
 * @returns {Promise<Array>} - List of photos
 */
export async function getPhotos() {
  return fetchAPI('/api/photos');
}
