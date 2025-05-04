'use client';

import React, { useState } from 'react';

const RoutineEditor = ({ routineItem, onSave, onCancel }) => {
  const [time, setTime] = useState(routineItem?.time || '');
  const [activity, setActivity] = useState(routineItem?.activity || '');
  const [hasDetails, setHasDetails] = useState(routineItem?.hasDetails || false);
  const [details, setDetails] = useState(routineItem?.details || '');

  // Common time options for easier selection
  const timeOptions = [
    '5 AM', '5:30 AM', '6 AM', '6:30 AM', '7 AM', '7:30 AM', '8 AM', '8:30 AM', '9 AM', '9:30 AM', '10 AM', '10:30 AM', '11 AM', '11:30 AM',
    '12 PM', '12:30 PM', '1 PM', '1:30 PM', '2 PM', '2:30 PM', '3 PM', '3:30 PM', '4 PM', '4:30 PM', '5 PM', '5:30 PM', '6 PM', '6:30 PM',
    '7 PM', '7:30 PM', '8 PM', '8:30 PM', '9 PM', '9:30 PM', '10 PM', '10:30 PM', '11 PM'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!time || !activity) {
      alert('Please fill in both time and activity');
      return;
    }
    
    // Create updated or new routine item
    const updatedItem = {
      id: routineItem?.id || `routine-${Date.now()}`,
      time,
      activity,
      hasDetails,
      details: hasDetails ? details : '',
      completed: routineItem?.completed || false,
      isRoutine: true
    };
    
    onSave(updatedItem);
  };

  return (
    <div className="routine-editor bg-white rounded-lg p-4 shadow-md">
      <h3 className="font-bold text-lg mb-3">
        {routineItem ? 'Edit Routine Activity' : 'Add Routine Activity'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Time</label>
          <div className="relative">
            <select
              className="w-full p-2 border border-gray-300 rounded-md appearance-none"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            >
              <option value="">Select time</option>
              {timeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
              <option value="custom">Custom time...</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {time === 'custom' && (
            <input 
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md mt-2"
              placeholder="Enter custom time (e.g., 7:15 AM)"
              onChange={(e) => setTime(e.target.value)}
              required
            />
          )}
        </div>
        
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Activity</label>
          <input 
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="What needs to be done?"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-3">
          <div className="flex items-center">
            <input 
              type="checkbox"
              id="hasDetails"
              className="mr-2 h-4 w-4"
              checked={hasDetails}
              onChange={(e) => setHasDetails(e.target.checked)}
            />
            <label htmlFor="hasDetails" className="text-sm font-medium">
              Add details to this activity
            </label>
          </div>
        </div>
        
        {hasDetails && (
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Details</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md h-20 resize-none"
              placeholder="Add notes or instructions for this activity..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
        )}
        
        <div className="flex justify-between mt-4">
          <button 
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
          >
            Cancel
          </button>
          
          <button 
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoutineEditor;