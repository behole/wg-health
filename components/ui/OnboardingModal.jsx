'use client';

import React from 'react';

export default function OnboardingModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl text-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome!</h2>
        
        <p className="text-base mb-3">
          This dashboard helps you manage your day. Here's a quick look:
        </p>
        
        <ul className="list-disc list-inside space-y-2 text-base mb-5">
          <li><strong>Priorities:</strong> See your main tasks for the day. Tap the circle to mark them done.</li>
          <li><strong>Routine:</strong> Follow your daily schedule. Tap the circle as you complete items.</li>
          <li><strong>Quick Access:</strong> Use the buttons (like 📚, 📺) for quick access to common items.</li>
          <li><strong>Notes:</strong> Send a quick note to family using the text box at the bottom.</li>
          <li><strong>Calls:</strong> Tap the buttons to easily call family members.</li>
        </ul>

        <p className="text-sm text-gray-600 mb-5">
          You can hide or show the Priorities and Routine sections using the 👀/😎 buttons.
        </p>
        
        <button 
          onClick={onClose}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          aria-label="Close onboarding message"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
