import React, { useState } from 'react';

const AppointmentForm = ({ onAddAppointment }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0], // Default to today
    time: '09:00',
    location: '',
    withPerson: '',
    notes: '',
  });

  // Predefined time options to simplify selection
  const timeOptions = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  // Format time for display
  const formatTimeForDisplay = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddAppointment(formData);
    // Reset form
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      location: '',
      withPerson: '',
      notes: '',
    });
    // Show confirmation message
    alert('Your appointment request has been sent to your family!');
  };

  return (
    <div id="add-appointment" className="bg-white rounded-xl shadow p-4 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Add Something to My Schedule</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* What is this appointment for? */}
        <div>
          <label htmlFor="title" className="block text-lg font-medium mb-1">
            What is this appointment for?
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            required
            onChange={handleChange}
            placeholder="Example: Doctor visit"
            className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg"
          />
        </div>
        
        {/* Date Selection */}
        <div>
          <label htmlFor="date" className="block text-lg font-medium mb-1">
            What day?
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg"
          />
        </div>
        
        {/* Time Selection */}
        <div>
          <label htmlFor="time" className="block text-lg font-medium mb-1">
            What time?
          </label>
          <select
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg"
          >
            {timeOptions.map(time => (
              <option key={time} value={time}>
                {formatTimeForDisplay(time)}
              </option>
            ))}
          </select>
        </div>
        
        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-lg font-medium mb-1">
            Where is this happening? (Optional)
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Example: Doctor's office"
            className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg"
          />
        </div>
        
        {/* With Person */}
        <div>
          <label htmlFor="withPerson" className="block text-lg font-medium mb-1">
            Who will be there with you? (Optional)
          </label>
          <input
            type="text"
            id="withPerson"
            name="withPerson"
            value={formData.withPerson}
            onChange={handleChange}
            placeholder="Example: Sarah"
            className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg"
          />
        </div>
        
        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-lg font-medium mb-1">
            Any other details to remember? (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="2"
            placeholder="Example: Bring the blue folder"
            className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg"
          />
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 active:bg-green-700 text-white text-lg font-bold py-4 px-4 rounded-lg flex justify-center items-center mt-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Send to My Family
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
