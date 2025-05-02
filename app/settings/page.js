'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [weatherLocation, setWeatherLocation] = useState('92054');
  const [resetConfirm, setResetConfirm] = useState(false);
  
  // Load existing preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPreferences = localStorage.getItem('userPreferences');
      
      if (storedPreferences) {
        try {
          const prefs = JSON.parse(storedPreferences);
          setName(prefs.name || '');
          setPreferredName(prefs.preferredName || '');
          setWeatherLocation(prefs.weatherLocation || '92054');
        } catch (err) {
          console.error('Error parsing stored preferences:', err);
        }
      }
    }
  }, []);
  
  const handleSave = (e) => {
    e.preventDefault();
    
    if (typeof window !== 'undefined') {
      // Create preferences object
      const preferences = {
        name: name.trim() || 'Mom',
        preferredName: preferredName.trim() || (name.trim() || 'Mom'),
        weatherLocation: weatherLocation || '92054'
      };
      
      // Save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      // Redirect back to home page
      router.push('/');
    }
  };
  
  const handleResetOnboarding = () => {
    if (resetConfirm) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('hasSeenMomAppOnboarding');
        localStorage.removeItem('hasCompletedTooltipTour');
        
        // Redirect to home page to restart onboarding
        router.push('/');
      }
    } else {
      setResetConfirm(true);
    }
  };
  
  return (
    <main className="flex flex-col min-h-screen bg-white text-black w-full max-w-md md:max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Link href="/" className="text-purple-600 font-medium">
          Back to Home
        </Link>
      </div>
      
      <form onSubmit={handleSave} className="mb-8">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2">Personal Information</h2>
        
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
            Display Name
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
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1" htmlFor="weatherLocation">
            ZIP Code (for weather)
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
        
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Save Changes
        </button>
      </form>
      
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-xl font-bold mb-4">Onboarding</h2>
        <p className="text-sm text-gray-600 mb-4">
          You can restart the welcome tour if you'd like to see it again.
        </p>
        
        <button
          onClick={handleResetOnboarding}
          className={`w-full border border-red-500 py-2 px-4 rounded-md mb-2 ${
            resetConfirm ? 'bg-red-600 text-white' : 'bg-white text-red-600'
          }`}
        >
          {resetConfirm ? 'Confirm Reset Onboarding' : 'Reset Welcome Tour'}
        </button>
        
        {resetConfirm && (
          <button
            onClick={() => setResetConfirm(false)}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md"
          >
            Cancel
          </button>
        )}
      </div>
    </main>
  );
}