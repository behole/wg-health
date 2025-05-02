'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PriorityItem from '../components/priorities/PriorityItem';
import ScheduleItem from '../components/schedule/ScheduleItem';
import SimpleTvModule from '../components/entertainment/SimpleTvModule';
import SimpleBooksModule from '../components/entertainment/SimpleBooksModule';
import SimpleMedicineModule from '../components/health/SimpleMedicineModule';
import SimpleFoodModule from '../components/food/SimpleFoodModule';
import WeatherCard from '../components/weather/WeatherCard';
import useQuote from '../hooks/useQuote';
import OnboardingModal from '../components/ui/OnboardingModal'; // Import the modal

export default function HomePage() {
  const [noteText, setNoteText] = useState('');
  const router = useRouter();
  
  const [showOnboarding, setShowOnboarding] = useState(false); // State for modal visibility
  
  // Get current date and time
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = today.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' });
  const currentHour = today.getHours();
  
  // Determine greeting based on time of day
  let greeting = "Good Morning!";
  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon!";
  } else if (currentHour >= 17) {
    greeting = "Good Evening!";
  }
  
  // Name state
  const names = ["MARY", "MOM", "MIMI"];
  const [randomName, setRandomName] = useState("MARY"); // Default to prevent hydration error
  
  // Set random name after initial render
  React.useEffect(() => {
    setRandomName(names[Math.floor(Math.random() * names.length)]);
  }, []);

  // Onboarding logic
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenMomAppOnboarding');
    // Check if running in browser environment before accessing localStorage
    if (typeof window !== 'undefined' && !hasSeenOnboarding) {
      setShowOnboarding(true);
    }
    // No dependency array needed if only checking on mount
  }, []);
  
  // UI state
  const [showPriorityForm, setShowPriorityForm] = useState(false);
  const [showRoutineForm, setShowRoutineForm] = useState(false);
  const [showPrioritiesSection, setShowPrioritiesSection] = useState(true);
  const [showRoutineSection, setShowRoutineSection] = useState(true);
  const [activeModule, setActiveModule] = useState(null);
  
  // Today's priorities (would come from API/database)
  const [priorities, setPriorities] = useState([
    { id: 1, text: 'Gather a Box for Goodwill', completed: false },
    { id: 2, text: 'Rayf Wrestling Meet', completed: false, time: 'Evening', hasDetails: true },
    { id: 3, text: 'Eat the Brownies', completed: false, time: 'Night' }
  ]);
  
  // Daily schedule (would come from API/database)
  const [schedule, setSchedule] = useState([
    { id: 1, time: '6 AM', activity: 'Wake Up', completed: true },
    { id: 2, time: '7:20 AM', activity: 'Rayf to School', completed: true },
    { id: 3, time: '8:20 AM', activity: 'Breakfast', completed: true, hasDetails: true },
    { id: 4, time: '9 AM', activity: 'Walk the Dogs', completed: true },
    { id: 5, time: '10 AM', activity: '10 Min Meditation', completed: true, hasDetails: true },
    { id: 6, time: '12:30 PM', activity: 'Lunch', completed: true, hasDetails: true },
    { id: 7, time: '1-2 PM', activity: 'Chores', completed: false, hasDetails: true },
    { id: 8, time: '2:30 PM', activity: 'Walk the Dogs', completed: false },
    { id: 9, time: '3:20 PM', activity: 'Pick Up Rayf', completed: false },
    { id: 10, time: '4-6 PM', activity: 'Me Time', completed: false },
    { id: 11, time: '6:30 PM', activity: 'Dinner', completed: false, hasDetails: true },
    { id: 12, time: '8:30PM', activity: 'Medication', completed: false },
    { id: 13, time: '10 PM', activity: 'Bedtime Ritual', completed: false, hasDetails: true }
  ]);
  
  // Quick access items with emoji icons
  const quickAccessItems = [
    { id: 1, name: 'Books', emoji: '📚' },
    { id: 2, name: 'TV', emoji: '📺' },
    { id: 3, name: 'Medicine', emoji: '💊' },
    { id: 4, name: 'Food', emoji: '🍽️' },
    { id: 5, name: 'Crafts', emoji: '🧶' },
    { id: 6, name: 'Map', emoji: '🗺️' }
  ];
  
  const handleTogglePriority = (id) => {
    setPriorities(priorities.map(priority => 
      priority.id === id ? { ...priority, completed: !priority.completed } : priority
    ));
  };
  
  const handleToggleScheduleItem = (id) => {
    setSchedule(schedule.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };
  
  const handleAddNote = () => {
    if (noteText.trim()) {
      alert('Note sent to family: ' + noteText);
      setNoteText('');
    }
  };
  
  const handleQuickAccess = (item) => {
    setActiveModule(item.name);
  };
  
  const closeModule = () => {
    setActiveModule(null);
  };
  
  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    // Check if running in browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenMomAppOnboarding', 'true');
    }
  };

  const handleAddAppointment = () => {
    router.push('/appointment');
  };
  const togglePriorityForm = () => {
    setShowPriorityForm(!showPriorityForm);
  };
  
  const toggleRoutineForm = () => {
    setShowRoutineForm(!showRoutineForm);
  };
  
  const togglePrioritiesSection = () => {
    setShowPrioritiesSection(!showPrioritiesSection);
  };
  
  const toggleRoutineSection = () => {
    setShowRoutineSection(!showRoutineSection);
  };

  return (
    <main className="flex flex-col min-h-screen bg-white text-black w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto">
      {/* Render Onboarding Modal */}
      <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />

      {/* Beta Banner */}
      <div className="fixed top-0 left-0 right-0 bg-black text-white text-xs text-center py-1 font-mono z-10">
        BETA BETA BETA BETA BETA BETA BETA
      </div>
      <div className="h-6"></div> {/* Spacer for fixed banner */}
      
      {/* Header */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm">{greeting}</p>
            <h1 className="text-5xl font-bold leading-none">{randomName}</h1>
          </div>
          <div className="text-right">
            <p className="text-sm">{dayName} {dateStr}</p>
          </div>
        </div>
        
        {/* Weather Card - using zip code for Oceanside, CA */}
        <WeatherCard zipCode="92054" />
        
        {/* Inspirational Quote */}
        <div className="border-t border-b border-gray-300 py-2 my-3">
          {/* Get daily quote from the hook */}
          <QuoteDisplay />
        </div>
      </div>
      
      {/* Today's Priorities */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold">Today's Priorities 
            <button 
              onClick={togglePriorityForm} 
              className="text-purple-600 ml-1"
              aria-label="Add priority"
            >+</button>
          </h2>
          <button 
            onClick={togglePrioritiesSection}
            className="text-xl"
            aria-label={showPrioritiesSection ? "Hide priorities" : "Show priorities"}
          >
            {showPrioritiesSection ? "👀" : "😎"}
          </button>
        </div>
        
        {showPrioritiesSection && (
          <>
            {/* Hidden Add Priority Form */}
            {showPriorityForm && (
              <div className="mb-3 p-2 border border-black bg-gray-50">
                <input 
                  type="text" 
                  className="w-full border border-gray-300 p-2 mb-2" 
                  placeholder="New priority..."
                />
                <div className="flex justify-end">
                  <button className="px-3 py-1 bg-black text-white">Add</button>
                </div>
              </div>
            )}
            
            <ul>
              {priorities.map(priority => (
                <PriorityItem 
                  key={priority.id}
                  priority={priority}
                  onToggle={handleTogglePriority}
                />
              ))}
            </ul>
          </>
        )}
      </div>
      
      {/* Daily Schedule */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold">Friday Routine 
            <button 
              onClick={toggleRoutineForm} 
              className="text-purple-600 ml-1"
              aria-label="Add routine item"
            >+</button>
          </h2>
          <button 
            onClick={toggleRoutineSection}
            className="text-xl"
            aria-label={showRoutineSection ? "Hide routine" : "Show routine"}
          >
            {showRoutineSection ? "👀" : "😎"}
          </button>
        </div>
        
        {showRoutineSection && (
          <>
            {/* Hidden Add Routine Form */}
            {showRoutineForm && (
              <div className="mb-3 p-2 border border-black bg-gray-50">
                <div className="mb-2">
                  <input 
                    type="text" 
                    className="w-1/3 border border-gray-300 p-2 mr-2" 
                    placeholder="Time"
                  />
                  <input 
                    type="text" 
                    className="w-3/5 border border-gray-300 p-2" 
                    placeholder="Activity"
                  />
                </div>
                <div className="flex justify-end">
                  <button className="px-3 py-1 bg-black text-white">Add</button>
                </div>
              </div>
            )}
            
            <div className="relative">
              {/* Vertical timeline line with progress */}
              <div className="absolute left-2 top-0 bottom-0 w-1 bg-gray-200"></div>
              {/* Progress bar overlay */}
              {schedule.length > 0 && (
                <div 
                  className="absolute left-2 top-0 w-1 bg-yellow-400" 
                  style={{ 
                    height: `${(schedule.filter(item => item.completed).length / schedule.length) * 100}%` 
                  }}
                ></div>
              )}
              
              <ul className="pl-6">
                {schedule.map(item => (
                  <ScheduleItem 
                    key={item.id}
                    item={item}
                    onToggle={handleToggleScheduleItem}
                  />
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
      
      {/* Add Appointment Button */}
      <button 
        onClick={handleAddAppointment}
        className="bg-black text-white py-3 px-4 flex justify-between items-center w-full mb-4"
      >
        <span className="font-bold">ADD AN APPOINTMENT</span>
        <span className="text-xl">+</span>
      </button>
      
      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 px-4 mb-4">
        {quickAccessItems.map(item => (
          <button 
            key={item.id} 
            className="border border-gray-300 p-4 flex flex-col justify-center items-center h-24 hover:bg-gray-50 transition-colors"
            onClick={() => handleQuickAccess(item)}
            aria-label={`Open ${item.name}`}
          >
            <span className="text-4xl mb-2">{item.emoji}</span>
            <span className="text-sm">{item.name}</span>
          </button>
        ))}
      </div>
      
      {/* Notes Input */}
      <div className="px-4 mb-4">
        <div className="border-2 border-black rounded-lg overflow-hidden">
          <textarea 
            className="w-full p-3 h-24 text-sm resize-none"
            placeholder="Add suggestions or notes here"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          ></textarea>
          <div className="bg-black text-white py-1 px-3 text-right">
            <button 
              onClick={handleAddNote} 
              className="text-sm"
              aria-label="Send note to family"
            >
              Send →
            </button>
          </div>
        </div>
      </div>
      
      {/* Call Buttons */}
      <div className="px-4 mb-8">
        <a 
          href="tel:+15551234567"
          className="block w-full bg-white border-2 border-black rounded-full py-3 mb-2 font-bold text-center flex items-center justify-center"
        >
          <span className="mr-2">📞</span> Call Mike
        </a>
        <a 
          href="tel:+15552345678"
          className="block w-full bg-white border-2 border-black rounded-full py-3 mb-2 font-bold text-center flex items-center justify-center"
        >
          <span className="mr-2">📞</span> Call Sarah
        </a>
        <a 
          href="tel:+15553456789"
          className="block w-full bg-white border-2 border-black rounded-full py-3 font-bold text-center flex items-center justify-center"
        >
          <span className="mr-2">📞</span> Call Josh
        </a>
      </div>
      
      {/* Modules */}
      {activeModule === 'TV' && <SimpleTvModule onClose={closeModule} />}
      {activeModule === 'Books' && <SimpleBooksModule onClose={closeModule} />}
      {activeModule === 'Medicine' && <SimpleMedicineModule onClose={closeModule} />}
      {activeModule === 'Food' && <SimpleFoodModule onClose={closeModule} />}
      {/* Other modules can be added here later */}
    </main>
  );
}

// Quote display component - separating this to use the hook
const QuoteDisplay = () => {
  const { quote, loading } = useQuote();
  
  if (loading) {
    return <div className="text-sm italic text-gray-500">Loading daily inspiration...</div>;
  }
  
  return (
    <div className="text-sm">
      <p className="italic">{quote.text}</p>
      {quote.author && <p className="text-right text-xs mt-1">— {quote.author}</p>}
    </div>
  );
};
