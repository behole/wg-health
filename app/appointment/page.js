'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AppointmentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    location: '',
    withPerson: '',
    notes: '',
  });

  // Time options for the dropdown
  const timeOptions = [
    { value: '08:00', label: '8:00 AM' },
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '17:00', label: '5:00 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '19:00', label: '7:00 PM' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send this data to your API
    console.log(formData);
    alert('Your appointment has been sent to your family!');
    router.push('/');
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <main className="flex flex-col min-h-screen bg-white text-black max-w-md mx-auto p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button 
          onClick={handleCancel}
          className="mr-2 text-2xl"
          aria-label="Go back"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold">Add New Appointment</h1>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block font-medium mb-1">
            What is this appointment for?
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border-2 border-black rounded-lg p-3"
            placeholder="Doctor, Lunch with Sarah, etc."
          />
        </div>
        
        {/* Date */}
        <div>
          <label htmlFor="date" className="block font-medium mb-1">
            What day?
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full border-2 border-black rounded-lg p-3"
          />
        </div>
        
        {/* Time */}
        <div>
          <label htmlFor="time" className="block font-medium mb-1">
            What time?
          </label>
          <select
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="w-full border-2 border-black rounded-lg p-3"
          >
            {timeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Location */}
        <div>
          <label htmlFor="location" className="block font-medium mb-1">
            Where is it happening? (Optional)
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border-2 border-black rounded-lg p-3"
            placeholder="Doctor's office, Sarah's house, etc."
          />
        </div>
        
        {/* With Person */}
        <div>
          <label htmlFor="withPerson" className="block font-medium mb-1">
            Who will you be with? (Optional)
          </label>
          <input
            type="text"
            id="withPerson"
            name="withPerson"
            value={formData.withPerson}
            onChange={handleChange}
            className="w-full border-2 border-black rounded-lg p-3"
            placeholder="Dr. Smith, Sarah, etc."
          />
        </div>
        
        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block font-medium mb-1">
            Any other details to remember? (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full border-2 border-black rounded-lg p-3 resize-none"
            placeholder="Bring insurance card, wear comfortable shoes, etc."
          />
        </div>
        
        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-black text-white font-bold py-3 rounded-lg"
          >
            Send to My Family
          </button>
        </div>
        
        {/* Cancel Button */}
        <div>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full bg-white border-2 border-black text-black font-bold py-3 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
