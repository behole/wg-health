'use client';

import React, { useState } from 'react';
import UserPreferencesStep from './UserPreferencesStep';
import RoutineSetupStep from './RoutineSetupStep';
import OnboardingIllustration from './OnboardingIllustration';

export default function OnboardingModal({ isOpen, onClose, onSavePreferences, onSaveRoutine }) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6; // Added one more step for routine setup
  
  // Store routine data temporarily if needed
  const [routineData, setRoutineData] = useState(null);
  
  if (!isOpen) return null;
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Apply any pending changes before closing
      if (routineData && onSaveRoutine) {
        onSaveRoutine(routineData);
      }
      onClose(); // Close the modal on the last step
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    onClose();
  };
  
  const handleSavePreferences = (preferences) => {
    // Save the preferences and move to the next step
    if (onSavePreferences) {
      onSavePreferences(preferences);
    }
    
    // Go to the next step after saving preferences
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };
  
  const handleSaveRoutine = (routineConfig) => {
    // Store routine data temporarily or save it immediately
    setRoutineData(routineConfig);
    
    // Process routine directly if handler is provided
    if (onSaveRoutine) {
      onSaveRoutine(routineConfig);
    }
    
    // Go to the next step
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl text-gray-800">
        {/* Progress Indicator */}
        <div className="flex justify-between mb-6">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div 
              key={i} 
              className={`h-1 flex-1 mx-1 rounded-full ${
                i + 1 <= currentStep ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            ></div>
          ))}
        </div>
        
        {/* Step 1: Welcome */}
        {currentStep === 1 && (
          <div className="step-content">
            <h2 className="text-2xl font-bold mb-4 text-center">Welcome!</h2>
            <p className="text-base mb-4">
              This dashboard is designed to make your day easier. Let's get to know it!
            </p>
            
            <OnboardingIllustration type="welcome" />
            
            <p className="text-sm text-gray-600 mb-5">
              This quick tour will help you get comfortable with your daily dashboard.
            </p>
          </div>
        )}
        
        {/* Step 2: Daily Structure */}
        {currentStep === 2 && (
          <div className="step-content">
            <h2 className="text-2xl font-bold mb-4 text-center">Daily Structure</h2>
            
            <OnboardingIllustration type="daily" />
            
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Priorities & Routine</h3>
              <p className="text-sm mb-3">
                Your day is organized into two main sections:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm mb-3">
                <li><strong>Today's Priorities:</strong> Important tasks for today</li>
                <li><strong>Daily Routine:</strong> Your regular schedule</li>
              </ul>
              <p className="text-sm text-gray-600">
                Tap the circles to mark items as completed as you go through your day.
              </p>
            </div>
          </div>
        )}
        
        {/* Step 3: Quick Access */}
        {currentStep === 3 && (
          <div className="step-content">
            <h2 className="text-2xl font-bold mb-4 text-center">Quick Access</h2>
            
            <OnboardingIllustration type="quickAccess" />
            
            <p className="text-base mb-2">
              Everything you need is a tap away:
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">📚</span>
                <span className="text-xs">Books</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">📺</span>
                <span className="text-xs">TV</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">💊</span>
                <span className="text-xs">Medicine</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">🍽️</span>
                <span className="text-xs">Food</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">🧶</span>
                <span className="text-xs">Crafts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">🗺️</span>
                <span className="text-xs">Map</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Tap any icon to quickly access information and options.
            </p>
          </div>
        )}
        
        {/* Step 4: Communication */}
        {currentStep === 4 && (
          <div className="step-content">
            <h2 className="text-2xl font-bold mb-4 text-center">Stay Connected</h2>
            
            <OnboardingIllustration type="connect" />
            
            <div className="space-y-3 mb-4">
              <div>
                <h3 className="font-semibold mb-1">Send Notes</h3>
                <p className="text-sm">
                  Use the notes box to send messages to your family.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Quick Calls</h3>
                <p className="text-sm">
                  Call buttons make it easy to reach your loved ones with one tap.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Manage Appointments</h3>
                <p className="text-sm">
                  Add appointments to your calendar with the "Add an Appointment" button.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Next, let's personalize your dashboard!
            </p>
          </div>
        )}
        
        {/* Step 5: User Preferences */}
        {currentStep === 5 && (
          <div className="step-content">
            <UserPreferencesStep 
              onSave={handleSavePreferences}
              onSkip={handleNext}
            />
          </div>
        )}
        
        {/* Step 6: Routine Setup */}
        {currentStep === 6 && (
          <div className="step-content">
            <RoutineSetupStep 
              onSave={handleSaveRoutine}
              onSkip={handleNext}
            />
          </div>
        )}
        
        {/* Navigation Buttons - Only show when not on form steps */}
        {(currentStep !== 5 && currentStep !== 6) && (
          <div className="flex justify-between mt-4">
            {currentStep > 1 ? (
              <button 
                onClick={handleBack}
                className="text-purple-600 px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                aria-label="Go back"
              >
                Back
              </button>
            ) : (
              <button 
                onClick={handleSkip}
                className="text-gray-500 px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="Skip onboarding"
              >
                Skip
              </button>
            )}
            
            <button 
              onClick={handleNext}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              aria-label={currentStep === totalSteps ? "Finish onboarding" : "Next step"}
            >
              {currentStep === totalSteps ? "Finish" : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}