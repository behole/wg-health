/**
 * Calendar service - Functions for managing appointments
 */

// Fetch all appointments
export async function getAppointments() {
  try {
    const response = await fetch('/api/calendar');
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.appointments;
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return [];
  }
}

// Add a new appointment
export async function addAppointment(appointmentData) {
  try {
    const response = await fetch('/api/calendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to add appointment:', error);
    throw error;
  }
}

// Update an existing appointment (for admin use)
export async function updateAppointment(appointmentData) {
  try {
    const response = await fetch('/api/calendar', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to update appointment:', error);
    throw error;
  }
}

// Delete an appointment (for admin use)
export async function deleteAppointment(id) {
  try {
    const response = await fetch(`/api/calendar?id=${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to delete appointment:', error);
    throw error;
  }
}

// Helper function to format dates for display
export function formatDate(dateString) {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Get today's date in YYYY-MM-DD format
export function getTodayString() {
  return new Date().toISOString().split('T')[0];
}
