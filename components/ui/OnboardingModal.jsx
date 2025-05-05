'use client';

// NOTE: For debugging hooks issues, we're switching to a more conservative approach
import React from 'react';

// Helper functions moved outside component
function addMinutesToTime(timeString, minutesToAdd) {
  const [time, period] = timeString.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  // Convert to 24-hour format
  let totalHours = hours;
  if (period === 'PM' && hours < 12) totalHours += 12;
  if (period === 'AM' && hours === 12) totalHours = 0;
  
  // Calculate new time
  let totalMinutes = totalHours * 60 + minutes + minutesToAdd;
  let newHours = Math.floor(totalMinutes / 60) % 24;
  let newMinutes = totalMinutes % 60;
  
  // Convert back to 12-hour format
  let newPeriod = newHours >= 12 ? 'PM' : 'AM';
  newHours = newHours % 12 || 12;
  
  return `${newHours}:${newMinutes.toString().padStart(2, '0')} ${newPeriod}`;
}

function subtractMinutesFromTime(timeString, minutesToSubtract) {
  return addMinutesToTime(timeString, -minutesToSubtract);
}

function convertTimeToMinutes(timeString) {
  const [time, period] = timeString.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  let totalHours = hours;
  if (period === 'PM' && hours < 12) totalHours += 12;
  if (period === 'AM' && hours === 12) totalHours = 0;
  
  return totalHours * 60 + minutes;
}

// Main component
export default function OnboardingModal({ isOpen, onClose, onSavePreferences, onSaveRoutine }) {
  // Single state object to manage all state
  const [state, setState] = React.useState({
    currentScreen: 1,
    role: null
  });
  
  // Reference to store daily tracking settings
  const trackingRef = React.useRef({
    selectedTemplate: 'balanced',
    wakeupTime: '7:00 AM',
    bedTime: '10:00 PM',
    hasPets: false,
    takeMedication: false
  });

  // Break out individual state properties
  const { currentScreen, role } = state;
  
  // State update functions
  const goToNextScreen = () => {
    setState(prev => ({ ...prev, currentScreen: prev.currentScreen + 1 }));
  };
  
  const goToPrevScreen = () => {
    setState(prev => ({ 
      ...prev, 
      currentScreen: prev.currentScreen > 1 ? prev.currentScreen - 1 : 1 
    }));
  };
  
  const selectRole = (selectedRole) => {
    setState(prev => ({ ...prev, role: selectedRole }));
  };
  
  // Function to update tracking settings
  const updateTrackingSettings = (settings) => {
    trackingRef.current = {
      ...trackingRef.current,
      ...settings
    };
  };
  
  // Handle finish function
  const handleFinish = () => {
    // Apply any pending changes before closing
    if (onSavePreferences) {
      // Get user preferences from localStorage if available
      let userPrefs = {
        name: 'Mom',
        preferredName: 'Mom',
        weatherLocation: '92054',
        timeZone: 'America/Los_Angeles'
      };
      
      if (typeof window !== 'undefined') {
        try {
          const savedPrefs = localStorage.getItem('userPreferences');
          if (savedPrefs) {
            userPrefs = JSON.parse(savedPrefs);
          }
        } catch (err) {
          console.error('Error parsing stored preferences:', err);
        }
      }
      
      onSavePreferences(userPrefs);
    }
    
    // Also save routine if available
    if (onSaveRoutine) {
      // Try to get settings from localStorage first, then fall back to ref
      let routineSettings = trackingRef.current;
      
      if (typeof window !== 'undefined') {
        try {
          const savedSettings = localStorage.getItem('dailyRoutineSettings');
          if (savedSettings) {
            routineSettings = {
              ...routineSettings,
              ...JSON.parse(savedSettings)
            };
          }
        } catch (err) {
          console.error('Error parsing stored routine settings:', err);
        }
      }
      
      // Get the tracking settings
      const { selectedTemplate, wakeupTime, bedTime, hasPets, takeMedication } = routineSettings;
      
      // Create routine items based on template and settings
      const routineItems = [];
      
      // Add wake up time
      routineItems.push({
        id: `routine-${Date.now()}-1`,
        time: wakeupTime,
        activity: 'Wake Up',
        completed: false,
        isRoutine: true
      });
      
      // Add breakfast (30 minutes after waking up)
      routineItems.push({
        id: `routine-${Date.now()}-2`,
        time: addMinutesToTime(wakeupTime, 30),
        activity: 'Breakfast',
        completed: false,
        isRoutine: true
      });
      
      // Add medication if selected
      if (takeMedication) {
        routineItems.push({
          id: `routine-${Date.now()}-3`,
          time: addMinutesToTime(wakeupTime, 60),
          activity: 'Morning Medication',
          hasDetails: true,
          details: 'Take morning medications with water after breakfast',
          completed: false,
          isRoutine: true
        });
        
        // Add evening medication
        routineItems.push({
          id: `routine-${Date.now()}-med-pm`,
          time: subtractMinutesFromTime(bedTime, 60),
          activity: 'Evening Medication',
          hasDetails: true,
          details: 'Take evening medications before bedtime routine',
          completed: false,
          isRoutine: true
        });
      }
      
      // Add pet care if selected
      if (hasPets) {
        routineItems.push({
          id: `routine-${Date.now()}-4`,
          time: addMinutesToTime(wakeupTime, 90),
          activity: 'Pet Care',
          completed: false,
          isRoutine: true
        });
        
        routineItems.push({
          id: `routine-${Date.now()}-5`,
          time: '6:30 PM',
          activity: 'Evening Pet Care',
          completed: false,
          isRoutine: true
        });
      }
      
      // Add template-specific activities
      if (selectedTemplate === 'relaxed') {
        routineItems.push(
          {
            id: `routine-${Date.now()}-7`,
            time: '10:00 AM',
            activity: 'Morning Tea Break',
            completed: false,
            isRoutine: true
          },
          {
            id: `routine-${Date.now()}-8`,
            time: '12:30 PM',
            activity: 'Lunch',
            completed: false,
            isRoutine: true
          },
          {
            id: `routine-${Date.now()}-9`,
            time: '1:30 PM',
            activity: 'Rest Time',
            completed: false,
            isRoutine: true
          },
          {
            id: `routine-${Date.now()}-10`,
            time: '4:00 PM',
            activity: 'Light Activity',
            completed: false,
            isRoutine: true
          }
        );
      } else if (selectedTemplate === 'balanced') {
        routineItems.push(
          {
            id: `routine-${Date.now()}-7`,
            time: '9:30 AM',
            activity: 'Morning Activity',
            completed: false,
            isRoutine: true
          },
          {
            id: `routine-${Date.now()}-8`,
            time: '12:00 PM',
            activity: 'Lunch',
            completed: false,
            isRoutine: true
          },
          {
            id: `routine-${Date.now()}-9`,
            time: '3:00 PM',
            activity: 'Afternoon Activity',
            completed: false,
            isRoutine: true
          }
        );
      } else if (selectedTemplate === 'active') {
        routineItems.push(
          {
            id: `routine-${Date.now()}-7`,
            time: addMinutesToTime(wakeupTime, 30),
            activity: 'Morning Exercise',
            hasDetails: true,
            details: 'Light stretching and movement to start the day',
            completed: false,
            isRoutine: true
          },
          {
            id: `routine-${Date.now()}-8`,
            time: '11:30 AM',
            activity: 'Lunch',
            completed: false,
            isRoutine: true
          },
          {
            id: `routine-${Date.now()}-9`,
            time: '4:30 PM',
            activity: 'Afternoon Exercise',
            completed: false,
            isRoutine: true
          }
        );
      }
      
      // Add common evening activities
      routineItems.push(
        {
          id: `routine-${Date.now()}-11`,
          time: '6:00 PM',
          activity: 'Dinner',
          completed: false,
          isRoutine: true
        },
        {
          id: `routine-${Date.now()}-12`,
          time: subtractMinutesFromTime(bedTime, 30),
          activity: 'Bedtime Routine',
          hasDetails: true,
          details: 'Prepare for sleep: brush teeth, change clothes, etc.',
          completed: false,
          isRoutine: true
        },
        {
          id: `routine-${Date.now()}-13`,
          time: bedTime,
          activity: 'Bedtime',
          completed: false,
          isRoutine: true
        }
      );
      
      // Sort the routine by time
      routineItems.sort((a, b) => {
        return convertTimeToMinutes(a.time) - convertTimeToMinutes(b.time);
      });
      
      onSaveRoutine({
        routineType: selectedTemplate || 'balanced',
        wakeupTime,
        bedTime,
        hasPets,
        takeMedication,
        routineItems
      });
    }
    
    onClose();
  };
  
  // Helper function to determine which screen to show - defined after handleFinish
  const getScreen = (step) => {
    switch (step) {
      case 1:
        return <WelcomeScreen onNext={goToNextScreen} />;
      case 2:
        return <RoleSelectionScreen onNext={goToNextScreen} onBack={goToPrevScreen} onSelectRole={selectRole} selectedRole={role} />;
      case 3:
        return <ProfileSetupScreen onNext={goToNextScreen} onBack={goToPrevScreen} />;
      case 4:
        return <PrivacyDataScreen onNext={goToNextScreen} onBack={goToPrevScreen} role={role} />;
      case 5:
        return role === 'caretaker' 
          ? <ConnectionSetupScreen onNext={goToNextScreen} onBack={goToPrevScreen} />
          : <DailyTrackingScreen onNext={goToNextScreen} onBack={goToPrevScreen} updateTrackingSettings={updateTrackingSettings} />;
      case 6:
        return role === 'caretaker'
          ? <DailyTrackingScreen onNext={goToNextScreen} onBack={goToPrevScreen} updateTrackingSettings={updateTrackingSettings} />
          : <SuccessScreen onFinish={handleFinish} onBack={goToPrevScreen} />;
      case 7:
        return role === 'caretaker'
          ? <SuccessScreen onFinish={handleFinish} onBack={goToPrevScreen} />
          : null;
      default:
        return null;
    }
  };
  
  // Calculate total steps once
  const totalSteps = role === 'caretaker' ? 7 : 6;
  
  // Early return after all hooks and function definitions
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 overflow-auto"
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="relative flex flex-col items-center justify-center min-h-screen py-8"
      >
        <div className="bg-white rounded-lg max-w-md w-full shadow-xl text-gray-800 mx-4 max-h-[90vh] flex flex-col relative">
          {/* Progress Indicator */}
          <div className="bg-white p-1 rounded-t-lg sticky top-0 left-0 right-0 z-10">
            <div className="flex justify-between mb-1">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div 
                  key={i} 
                  className={`h-1 flex-1 mx-1 rounded-full ${
                    i + 1 <= currentScreen ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Current Screen Content */}
          <div className="overflow-auto" style={{ maxHeight: 'calc(90vh - 40px)' }}>
            {getScreen(currentScreen)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step screen components
const WelcomeScreen = ({ onNext }) => {
  return (
    <div className="p-6 flex flex-col items-center text-center">
      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to Your Daily Dashboard</h1>
      <p className="text-xl text-gray-600 mb-6">Your friendly companion for daily activities</p>
      
      <p className="text-lg text-gray-600 mb-8">
        This dashboard helps you keep track of your activities and stay connected with your loved ones. Everything is simple, secure, and designed with your needs in mind.
      </p>
      
      <button 
        onClick={onNext}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl font-semibold py-4 px-6 rounded-lg mb-4 transition duration-300">
        Start Here
      </button>
      
      <p className="text-base text-gray-500 mb-4">
        This takes about 5 minutes. You can pause and come back anytime.
      </p>
      
      <p className="text-base text-gray-600 font-semibold">
        No technical knowledge needed. We guide you through each step.
      </p>
    </div>
  );
};

const RoleSelectionScreen = ({ onNext, onBack, onSelectRole, selectedRole }) => {
  const handleRoleSelect = (role) => {
    onSelectRole(role);
  };
  
  const handleContinue = () => {
    if (selectedRole) {
      onNext();
    } else {
      alert('Please select who you are before continuing');
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Tell us who you are</h1>
      
      <div className="space-y-4 mb-8">
        <div 
          onClick={() => handleRoleSelect('senior')}
          className={`border-2 ${selectedRole === 'senior' ? 'border-blue-500' : 'border-gray-200'} hover:border-blue-500 p-4 rounded-lg cursor-pointer transition duration-300 flex items-center`}
        >
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">I'm using this for myself</h3>
            <p className="text-gray-600">I want to keep track of my daily activities</p>
          </div>
        </div>
        
        <div 
          onClick={() => handleRoleSelect('caretaker')}
          className={`border-2 ${selectedRole === 'caretaker' ? 'border-blue-500' : 'border-gray-200'} hover:border-blue-500 p-4 rounded-lg cursor-pointer transition duration-300 flex items-center`}
        >
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">I'm helping someone else</h3>
            <p className="text-gray-600">I help care for a family member or friend and want to stay connected</p>
          </div>
        </div>
      </div>
      
      <p className="text-center text-gray-600 mb-8">
        This choice can be changed later in Settings if needed.
      </p>
      
      <div className="flex justify-between">
        <button 
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300">
          Back
        </button>
        <button 
          onClick={handleContinue}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
          Continue
        </button>
      </div>
    </div>
  );
};

const ProfileSetupScreen = ({ onNext, onBack }) => {
  // All state declarations in one place at the beginning
  const [formState, setFormState] = React.useState({
    name: '',
    preferredName: '',
    weatherLocation: '92054'
  });
  
  // Destructure for convenience
  const { name, preferredName, weatherLocation } = formState;
  
  // Helper functions for input changes
  const handleNameChange = (e) => {
    setFormState(prev => ({ ...prev, name: e.target.value }));
  };
  
  const handlePreferredNameChange = (e) => {
    setFormState(prev => ({ ...prev, preferredName: e.target.value }));
  };
  
  const handleWeatherLocationChange = (e) => {
    setFormState(prev => ({ ...prev, weatherLocation: e.target.value }));
  };
  
  // Continue function
  const handleContinue = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userPreferences', JSON.stringify({
        name: name || 'Mom',
        preferredName: preferredName || name || 'Mom',
        weatherLocation: weatherLocation || '92054',
        timeZone: 'America/Los_Angeles'
      }));
    }
    onNext();
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Let's create your profile</h1>
      
      <div className="mb-6">
        <label className="block text-xl text-gray-700 mb-2" htmlFor="name">
          Your name
        </label>
        <input 
          type="text" 
          id="name"
          className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" 
          placeholder="Enter your name here"
          value={name}
          onChange={handleNameChange}
        />
        <p className="text-gray-500 mt-2">For example: Mary, John, etc.</p>
      </div>
      
      <div className="mb-6">
        <label className="block text-xl text-gray-700 mb-2" htmlFor="preferredName">
          What should we call you?
        </label>
        <input 
          type="text" 
          id="preferredName"
          className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" 
          placeholder="Mom, Grandma, etc."
          value={preferredName}
          onChange={handlePreferredNameChange}
        />
        <p className="text-gray-500 mt-2">This is how you'll be seen in the app</p>
      </div>
      
      <div className="mb-8">
        <label className="block text-xl text-gray-700 mb-2" htmlFor="weatherLocation">
          ZIP Code (for weather)
        </label>
        <input 
          type="text" 
          id="weatherLocation"
          className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none" 
          placeholder="92054"
          value={weatherLocation}
          onChange={handleWeatherLocationChange}
        />
        <p className="text-gray-500 mt-2">We'll show you local weather information</p>
      </div>
      
      <p className="text-center text-gray-600 mb-8">
        You can always update your profile information later in Settings.
      </p>
      
      <div className="flex justify-between">
        <button 
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300">
          Back
        </button>
        <button 
          onClick={handleContinue}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
          Continue
        </button>
      </div>
    </div>
  );
};

const PrivacyDataScreen = ({ onNext, onBack, role }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">We understand privacy concerns</h1>
      <p className="text-xl text-gray-600 mb-6 text-center">Your information is safe with us</p>
      
      <div className="space-y-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Your Information Stays Private</h3>
          <p className="text-gray-600">
            Your daily details are stored securely and only shared with people you specifically choose. (You can change this anytime)
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">No Selling of Your Information</h3>
          <p className="text-gray-600">
            We never sell your personal details to other companies or use them for advertising.
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">You're Always in Control</h3>
          <p className="text-gray-600">
            You decide who can see your information, and you can change your mind anytime.
          </p>
        </div>
      </div>
      
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
        <p className="text-gray-700">
          <strong>Important note:</strong> We designed this app with strict privacy rules. Your information won't be shared unless you specifically allow it.
        </p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {role === 'senior' ? 'Your permission settings:' : 'Your caretaker agreement:'}
        </h3>
        
        {role === 'senior' ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <input type="checkbox" id="permission1" className="mt-1 w-5 h-5" />
              <label htmlFor="permission1" className="text-gray-700">
                I allow my caretaker to see my daily activities (You can change this anytime)
              </label>
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="permission2" className="mt-1 w-5 h-5" />
              <label htmlFor="permission2" className="text-gray-700">
                I allow my caretaker to receive notices about my activity (You can change this anytime)
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <input type="checkbox" id="agreement1" className="mt-1 w-5 h-5" />
              <label htmlFor="agreement1" className="text-gray-700">
                I will respect the privacy choices made by the person I care for
              </label>
            </div>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="agreement2" className="mt-1 w-5 h-5" />
              <label htmlFor="agreement2" className="text-gray-700">
                I understand I will only see information they've chosen to share with me
              </label>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <button 
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300">
          Back
        </button>
        <button 
          onClick={onNext}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
          Continue
        </button>
      </div>
    </div>
  );
};

const ConnectionSetupScreen = ({ onNext, onBack }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Connect with your loved one</h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
        To receive updates from the person you care for, you'll need to connect your accounts. This is easy to do.
      </p>
      
      <div className="space-y-4 mb-6">
        <div className="border border-gray-200 p-4 rounded-lg hover:border-blue-300 cursor-pointer transition duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-lg text-gray-700">Send an invitation by email</span>
          </div>
        </div>
        
        <div className="border border-gray-200 p-4 rounded-lg hover:border-blue-300 cursor-pointer transition duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-lg text-gray-700">Send an invitation by text message</span>
          </div>
        </div>
        
        <div className="border border-gray-200 p-4 rounded-lg hover:border-blue-300 cursor-pointer transition duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <span className="text-lg text-gray-700">Use a connection code</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-8">
        <p className="text-gray-700 mb-2">
          <strong>Connection code helper:</strong> If you're together right now, ask them to share their connection code from their Settings screen.
        </p>
        <p className="text-gray-700">
          A connection code looks like: <span className="font-mono bg-white px-2 py-1 rounded">MOM-1234</span>
        </p>
      </div>
      
      <p className="text-center text-gray-600 mb-8">
        Don't worry if you're not ready to connect now. You can set this up later from the Settings screen.
      </p>
      
      <div className="flex justify-between">
        <button 
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300">
          Back
        </button>
        <button 
          onClick={onNext}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
          Continue
        </button>
      </div>
    </div>
  );
};

const DailyTrackingScreen = ({ onNext, onBack, updateTrackingSettings }) => {
  // Consolidate all form state in a single state object
  const [trackingState, setTrackingState] = React.useState({
    selectedTemplate: 'balanced',
    wakeupTime: '7:00 AM',
    bedTime: '10:00 PM',
    hasPets: false,
    takeMedication: false
  });
  
  // Destructure state for convenience
  const { selectedTemplate, wakeupTime, bedTime, hasPets, takeMedication } = trackingState;
  
  // Common time options for easier selection
  const morningTimes = [
    '5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', 
    '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM'
  ];
  
  const eveningTimes = [
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', 
    '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM'
  ];
  
  // Routine templates - we'll use these as a base and customize them
  const routineTemplates = {
    relaxed: "A relaxed pace with plenty of rest time",
    balanced: "A balanced mix of activities and rest",
    active: "An active schedule with regular exercise"
  };
  
  // Update parent tracking settings when values change
  React.useEffect(() => {
    // Update the parent component's ref with our local state
    if (typeof updateTrackingSettings === 'function') {
      updateTrackingSettings(trackingState);
    }
  }, [trackingState, updateTrackingSettings]);
  
  // State update handlers
  const setSelectedTemplate = (template) => {
    setTrackingState(prev => ({ ...prev, selectedTemplate: template }));
  };
  
  const setWakeupTime = (time) => {
    setTrackingState(prev => ({ ...prev, wakeupTime: time }));
  };
  
  const setBedTime = (time) => {
    setTrackingState(prev => ({ ...prev, bedTime: time }));
  };
  
  const setHasPets = (value) => {
    setTrackingState(prev => ({ ...prev, hasPets: value }));
  };
  
  const setTakeMedication = (value) => {
    setTrackingState(prev => ({ ...prev, takeMedication: value }));
  };
  
  // Save settings when continuing
  const handleContinue = () => {
    // Save settings to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('dailyRoutineSettings', JSON.stringify(trackingState));
    }
    
    // Continue to next screen
    onNext();
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Daily Activity Tracking</h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
        Let's set up your daily routine to help you stay organized.
      </p>
      
      <div className="mb-6">
        <label className="block text-xl text-gray-700 mb-3">
          Select Your Routine Type
        </label>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(routineTemplates).map(([key, description]) => (
            <div
              key={key}
              className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedTemplate === key 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-300'
              }`}
              onClick={() => setSelectedTemplate(key)}
            >
              <div className="font-medium mb-1 capitalize">{key}</div>
              <div className="text-sm text-gray-600">{description}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="wakeupTime">
            Wake-up Time
          </label>
          <select
            id="wakeupTime"
            className="w-full border border-gray-300 rounded-md p-2"
            value={wakeupTime}
            onChange={(e) => setWakeupTime(e.target.value)}
          >
            {morningTimes.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="bedTime">
            Bedtime
          </label>
          <select
            id="bedTime"
            className="w-full border border-gray-300 rounded-md p-2"
            value={bedTime}
            onChange={(e) => setBedTime(e.target.value)}
          >
            {eveningTimes.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="space-y-2 mb-6">
        <div className="flex items-center">
          <input 
            type="checkbox"
            id="hasPets"
            className="h-4 w-4 mr-2"
            checked={hasPets}
            onChange={(e) => setHasPets(e.target.checked)}
          />
          <label htmlFor="hasPets" className="text-sm">
            I have pets that need daily care
          </label>
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox"
            id="takeMedication"
            className="h-4 w-4 mr-2"
            checked={takeMedication}
            onChange={(e) => setTakeMedication(e.target.checked)}
          />
          <label htmlFor="takeMedication" className="text-sm">
            I take daily medications
          </label>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button 
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300">
          Back
        </button>
        <button 
          onClick={handleContinue}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
          Continue
        </button>
      </div>
    </div>
  );
};

const SuccessScreen = ({ onFinish, onBack }) => {
  return (
    <div className="p-6 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Congratulations! You're All Set!</h1>
      <p className="text-xl text-gray-600 mb-6">
        Your daily dashboard is ready to use. We're here to help you stay organized and connected with those who care about you.
      </p>
      
      <p className="text-lg text-gray-700 mb-8">
        You can explore just one feature at a time. There's no rush to use everything at once.
      </p>
      
      <button 
        onClick={onFinish}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl font-semibold py-4 px-6 rounded-lg mb-6 transition duration-300">
        Go to My Dashboard
      </button>
      
      <p className="text-lg text-gray-600 mb-4">
        Questions or need help? Visit the Settings page anytime for assistance.
      </p>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-lg text-gray-700">
          Is this text easy to read? You can adjust text size in your device settings if needed.
        </p>
      </div>
      
      <div className="mt-8">
        <button 
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300">
          Back
        </button>
      </div>
    </div>
  );
};