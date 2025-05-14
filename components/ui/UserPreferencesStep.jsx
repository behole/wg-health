'use client';

import React, { useState } from 'react';
import OnboardingIllustration from './OnboardingIllustration';

const UserPreferencesStep = ({ onSave, onSkip }) => {
  const [name, setName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [timeZone, setTimeZone] = useState('America/Los_Angeles');
  const [weatherLocation, setWeatherLocation] = useState('92054');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create user preferences object
    const preferences = {
      name: name.trim() || 'Mom',
      preferredName: preferredName.trim() || (name.trim() || 'Mom'),
      timeZone,
      weatherLocation
    };
    
    // Call the save function with preferences
    onSave(preferences);
  };
  
  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4 text-center">Personalize Your Experience</h2>
      
      <OnboardingIllustration type="preferences" />
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full border border-gray-300 rounded-md p-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            placeholder="Mary"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="preferredName">
            What should we call you?
          </label>
          <input
            type="text"
            id="preferredName"
            className="w-full border border-gray-300 rounded-md p-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            placeholder="Mom, Grandma, etc."
            value={preferredName}
            onChange={(e) => setPreferredName(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be displayed on your dashboard.
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="weatherLocation">
            Postal Code (for weather)
          </label>
          <input
            type="text"
            id="weatherLocation"
            className="w-full border border-gray-300 rounded-md p-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            placeholder="92054"
            value={weatherLocation}
            onChange={(e) => setWeatherLocation(e.target.value)}
          />
        </div>
        
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-2 text-gray-500 hover:text-gray-700"
          >
            Skip
          </button>
          
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserPreferencesStep;