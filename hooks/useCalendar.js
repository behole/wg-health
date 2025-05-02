import { useState, useEffect } from 'react';
import { getAppointments, addAppointment } from '../lib/calendar';

/**
 * Custom hook for managing calendar data
 */
export default function useCalendar() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch appointments on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getAppointments();
        setAppointments(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Unable to load your schedule. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Function to add a new appointment
  const handleAddAppointment = async (appointmentData) => {
    try {
      setLoading(true);
      const result = await addAppointment(appointmentData);
      
      if (result.success) {
        // Update the local state with the new appointment
        setAppointments(prev => [...prev, result.appointment]);
        return { success: true };
      } else {
        setError(result.error || 'Failed to add appointment');
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('Error adding appointment:', err);
      setError('Failed to send your appointment. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    appointments,
    loading,
    error,
    addAppointment: handleAddAppointment
  };
}
