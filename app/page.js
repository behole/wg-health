'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PriorityItem from '../components/priorities/PriorityItem';
import ScheduleItem from '../components/schedule/ScheduleItem';
import DailyRoutine from '../components/schedule/DailyRoutine';
import RoutineEditor from '../components/schedule/RoutineEditor';
import SimpleTvModule from '../components/entertainment/SimpleTvModule';
import SimpleBooksModule from '../components/entertainment/SimpleBooksModule';
import SimpleMedicineModule from '../components/health/SimpleMedicineModule';
import SimpleFoodModule from '../components/food/SimpleFoodModule';
import WeatherCard from '../components/weather/WeatherCard';
import useQuote from '../hooks/useQuote';
import OnboardingModal from '../components/ui/OnboardingModal'; // Import the modal
import TooltipTour from '../components/ui/TooltipTour'; // Import the tooltip tour
import ClientOnly from '../components/ClientOnly'; // Import the ClientOnly component
import PriorityForm from '../components/priorities/PriorityForm';

export default function HomePage() {
  const [noteText, setNoteText] = useState('');
  const [userWakeTime, setUserWakeTime] = useState('06:00');
  const [userSleepTime, setUserSleepTime] = useState('22:00');
  const router = useRouter();
  
  const [showOnboarding, setShowOnboarding] = useState(false); // State for modal visibility
  const [showTooltipTour, setShowTooltipTour] = useState(false); // State for tooltip tour
  const [onboardingStep, setOnboardingStep] = useState(1); // Track onboarding progress
  const [userPreferences, setUserPreferences] = useState(null); // Store user preferences
  const [routineConfig, setRoutineConfig] = useState(null); // Store routine configuration
  const [isClientSide, setIsClientSide] = useState(false); // Track if we're client-side rendering
  // Schedule state - starts empty until we load saved routine or create new one
  const [schedule, setSchedule] = useState([]);
  
  // Static strings to prevent hydration errors
  const ROUTINE_TITLE = "Daily Routine"; // Always use this static string
  
  // Get current date and time (with a dummy value during SSR to prevent hydration mismatch)
  const dateObj = new Date();
  const currentHour = dateObj.getHours();
  
  // These date strings are only used after client-side rendering is confirmed
  const [dayName, setDayName] = useState(""); 
  const [dateStr, setDateStr] = useState("");
  
  // Determine greeting based on time of day - use a static value to prevent hydration mismatches
  // We'll update this once client-side rendering is active
  const [greeting, setGreeting] = useState("Hello!");
  
  // Update greeting based on time in useEffect
  useEffect(() => {
    if (!isClientSide) return;
    
    let newGreeting = "Good Morning!";
    if (currentHour >= 12 && currentHour < 17) {
      newGreeting = "Good Afternoon!";
    } else if (currentHour >= 17) {
      newGreeting = "Good Evening!";
    }
    setGreeting(newGreeting);
  }, [isClientSide, currentHour]);
  
  // Name state - modified to use preferences if available
  const names = ["USER", "BETA", "TESTER"];
  const [randomName, setRandomName] = useState("USER"); // Default to prevent hydration error
  
  // First useEffect to safely set client-side rendering flag and update date values
  useEffect(() => {
    // Mark that we're now on the client side
    setIsClientSide(true);
    
    // Now that we're on the client, we can safely set date-related values
    const today = new Date();
    setDayName(today.toLocaleDateString('en-US', { weekday: 'long' }));
    setDateStr(today.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' }));
  }, []);
  
  // Set random name after initial render, or use preferences
  useEffect(() => {
    // Only run on client-side to prevent hydration mismatch
    if (!isClientSide) return;
    
    // Check if we have stored preferences
    const storedPreferences = localStorage.getItem('userPreferences');
    if (storedPreferences) {
      try {
        const prefs = JSON.parse(storedPreferences);
        setUserPreferences(prefs);
        setRandomName(prefs.preferredName || prefs.name);
      } catch (err) {
        console.error('Error parsing stored preferences:', err);
        setRandomName(names[Math.floor(Math.random() * names.length)]);
      }
    } else {
      setRandomName(names[Math.floor(Math.random() * names.length)]);
    }
  }, [isClientSide, names]);

  // Load wake/sleep times from localStorage
  useEffect(() => {
    if (!isClientSide) return;
    
    try {
      const savedWakeTime = localStorage.getItem('userWakeTime');
      const savedSleepTime = localStorage.getItem('userSleepTime');
      if (savedWakeTime) setUserWakeTime(savedWakeTime);
      if (savedSleepTime) setUserSleepTime(savedSleepTime);
    } catch (error) {
      console.error('Failed to load wake/sleep preferences:', error);
    }
  }, [isClientSide]);
  
  // Save wake/sleep times to localStorage when they change
  useEffect(() => {
    if (!isClientSide) return;
    
    try {
      localStorage.setItem('userWakeTime', userWakeTime);
      localStorage.setItem('userSleepTime', userSleepTime);
    } catch (error) {
      console.error('Failed to save wake/sleep preferences:', error);
    }
  }, [userWakeTime, userSleepTime, isClientSide]);

  // Onboarding logic
  useEffect(() => {
    // Only run on client-side to prevent hydration mismatch
    if (!isClientSide) return;
    
    const hasSeenOnboarding = localStorage.getItem('hasSeenPlandAppOnboarding');
    const hasCompletedTour = localStorage.getItem('hasCompletedTooltipTour');
    
    if (!hasSeenOnboarding) {
      // First-time user: show the welcome modal
      setShowOnboarding(true);
      setOnboardingStep(1);
    } else if (hasSeenOnboarding && !hasCompletedTour) {
      // Has seen basic onboarding but not the tooltip tour
      setShowTooltipTour(true);
      setOnboardingStep(2);
    }
    
    // Load saved routines if available
    const savedRoutine = localStorage.getItem('dailyRoutine');
    if (savedRoutine) {
      try {
        const parsedRoutine = JSON.parse(savedRoutine);
        setRoutineConfig(parsedRoutine);
        
        // Also set the schedule from the saved routine items
        if (parsedRoutine.routineItems && Array.isArray(parsedRoutine.routineItems)) {
          setSchedule(parsedRoutine.routineItems);
        }
      } catch (error) {
        console.error('Error loading saved routine:', error);
      }
    }
  }, [isClientSide]);
  
  // UI state
  const [showPriorityForm, setShowPriorityForm] = useState(false);
  const [showRoutineForm, setShowRoutineForm] = useState(false);
  const [showRoutineEditor, setShowRoutineEditor] = useState(false);
  const [currentRoutineItem, setCurrentRoutineItem] = useState(null);
  const [showPrioritiesSection, setShowPrioritiesSection] = useState(true);
  const [showRoutineSection, setShowRoutineSection] = useState(true);
  const [activeModule, setActiveModule] = useState(null);
  
  // Today's priorities (would come from API/database)
  const [priorities, setPriorities] = useState([
    { id: 1, text: 'Gather a Box for Goodwill', completed: false, priority: 'medium' },
    { id: 2, text: 'Rayf Wrestling Meet', completed: false, time: 'Evening', hasDetails: true, priority: 'high' },
    { id: 3, text: 'Eat the Brownies', completed: false, time: 'Night', priority: 'low' }
  ]);

  // Priority editing state
  const [editingPriority, setEditingPriority] = useState(null);
  
  
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

  const handleAddPriority = (priorityData) => {
    setPriorities([...priorities, priorityData]);
    setShowPriorityForm(false);
  };

  const handleEditPriority = (priority) => {
    setEditingPriority(priority);
    setShowPriorityForm(true);
  };

  const handleUpdatePriority = (updatedPriority) => {
    setPriorities(priorities.map(priority => 
      priority.id === updatedPriority.id ? updatedPriority : priority
    ));
    setEditingPriority(null);
    setShowPriorityForm(false);
  };

  const handleDeletePriority = (id) => {
    if (window.confirm('Are you sure you want to delete this priority?')) {
      setPriorities(priorities.filter(priority => priority.id !== id));
    }
  };

  const handleCancelPriorityForm = () => {
    setEditingPriority(null);
    setShowPriorityForm(false);
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
      localStorage.setItem('hasSeenPlandAppOnboarding', 'true');
      
      // Start tooltip tour after modal is closed
      setTimeout(() => {
        setShowTooltipTour(true);
        setOnboardingStep(2);
      }, 500);
    }
  };
  
  const handleCompleteTooltipTour = () => {
    setShowTooltipTour(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasCompletedTooltipTour', 'true');
    }
  };
  
  const handleSkipTooltipTour = () => {
    setShowTooltipTour(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasCompletedTooltipTour', 'true');
    }
  };
  
  // Function to save user preferences
  const handleSavePreferences = (preferences) => {
    if (typeof window !== 'undefined') {
      // Save to state
      setUserPreferences(preferences);
      
      // Update display name
      setRandomName(preferences.preferredName || preferences.name);
      
      // Save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }
  };
  
  // Function to save routine configuration
  const handleSaveRoutine = (routineConfig) => {
    // Save routine to state
    setRoutineConfig(routineConfig);
    
    // Update schedule with only routine items - no mixing with static data
    if (routineConfig?.routineItems) {
      // Set schedule to be exactly the routine items
      setSchedule(routineConfig.routineItems);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('dailyRoutine', JSON.stringify(routineConfig));
      }
    }
  };
  
  // Handle routine item editing
  const handleEditRoutineItem = (item) => {
    setCurrentRoutineItem(item);
    setShowRoutineEditor(true);
  };
  
  // Handle saving edited routine item
  const handleSaveRoutineItem = (updatedItem) => {
    // Update item in schedule
    const updatedSchedule = schedule.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    
    setSchedule(updatedSchedule);
    
    // Update in routine config
    if (routineConfig) {
      const updatedRoutineItems = (routineConfig.routineItems || []).map(item => 
        item.id === updatedItem.id ? updatedItem : item
      );
      
      const newRoutineConfig = {
        ...routineConfig,
        routineItems: updatedRoutineItems,
      };
      
      setRoutineConfig(newRoutineConfig);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('dailyRoutine', JSON.stringify(newRoutineConfig));
      }
    }
    
    // Close the editor
    setShowRoutineEditor(false);
    setCurrentRoutineItem(null);
  };
  
  // Handle deleting routine item
  const handleDeleteRoutineItem = (itemId) => {
    if (confirm('Are you sure you want to remove this from your routine?')) {
      // Remove from schedule
      const updatedSchedule = schedule.filter(item => item.id !== itemId);
      setSchedule(updatedSchedule);
      
      // Remove from routine config
      if (routineConfig) {
        const updatedRoutineItems = (routineConfig.routineItems || []).filter(item => 
          item.id !== itemId
        );
        
        const newRoutineConfig = {
          ...routineConfig,
          routineItems: updatedRoutineItems,
        };
        
        setRoutineConfig(newRoutineConfig);
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('dailyRoutine', JSON.stringify(newRoutineConfig));
        }
      }
    }
  };
  
  // Function to reset onboarding (for testing)
  const resetOnboarding = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hasSeenPlandAppOnboarding');
      localStorage.removeItem('hasCompletedTooltipTour');
      localStorage.removeItem('userPreferences');
      localStorage.removeItem('dailyRoutine');
      window.location.reload();
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
  
  const closeRoutineEditor = () => {
    setShowRoutineEditor(false);
    setCurrentRoutineItem(null);
  };
  
  const addNewRoutineItem = () => {
    setCurrentRoutineItem(null);
    setShowRoutineEditor(true);
  };
  
  const resetRoutine = () => {
    if (confirm('Are you sure you want to reset your daily routine? This will remove all routine items.')) {
      // Clear schedule entirely - no placeholders
      setSchedule([]);
      
      // Clear routine config
      setRoutineConfig(null);
      
      // Remove from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('dailyRoutine');
      }
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-white text-black w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto">
      {/* Render Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={handleCloseOnboarding} 
        onSavePreferences={handleSavePreferences}
        onSaveRoutine={handleSaveRoutine}
      />
      
      {/* Render Tooltip Tour */}
      <TooltipTour 
        isActive={showTooltipTour} 
        onComplete={handleCompleteTooltipTour} 
        onSkip={handleSkipTooltipTour}
      />

      {/* Beta Banner and Settings Link */}
      <div className="fixed top-0 left-0 right-0 bg-black text-white text-xs text-center py-1 font-mono z-10 flex justify-between items-center px-2">
        <span>BETA BETA BETA</span>
        <Link href="/settings" className="text-white hover:text-gray-300">
          ⚙️
        </Link>
      </div>
      <div className="h-6"></div> {/* Spacer for fixed banner */}
      
      {/* Header */}
      <div className="px-4 py-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <ClientOnly fallback={<p className="text-xs font-semibold mb-1">Good Morning!</p>}>
              <p className="text-xs font-semibold mb-1">{greeting}</p>
            </ClientOnly>
            <h1 className="text-3xl font-bold leading-tight">{randomName}</h1>
          </div>
          <div className="text-right">
            <ClientOnly fallback={<p className="text-xs font-semibold">Tuesday 5.27.25</p>}>
              <p className="text-xs font-semibold">{dayName} {dateStr}</p>
            </ClientOnly>
          </div>
        </div>
        
        {/* Weather Card - using user's postal code or default */}
        <div id="weather-card">
          <ClientOnly>
            <WeatherCard postalCode={userPreferences?.weatherLocation || "M4B 1B3"} />
          </ClientOnly>
        </div>
        
        {/* Inspirational Quote */}
        <div className="border-t border-b border-gray-300 py-2 my-3">
          {/* Get daily quote from the hook */}
          <QuoteDisplay />
        </div>
      </div>
      
      {/* Today's Priorities */}
      <div className="px-4 mb-6" id="priorities-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Today's Priorities 
            <button 
              onClick={togglePriorityForm} 
              className="text-black ml-2 text-sm"
              aria-label="Add priority"
            >+</button>
          </h2>
        </div>
        
        {showPrioritiesSection && (
          <>
            {/* Priority Add/Edit Form */}
            {showPriorityForm && (
              <PriorityForm
                priority={editingPriority}
                onSave={editingPriority ? handleUpdatePriority : handleAddPriority}
                onCancel={handleCancelPriorityForm}
              />
            )}
            
            {/* Priorities List */}
            {priorities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📝</div>
                <p>No priorities for today!</p>
                <p className="text-sm">Click the + button to add your first priority.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {priorities
                  .sort((a, b) => {
                    // Sort by completion status, then by priority level
                    if (a.completed !== b.completed) {
                      return a.completed ? 1 : -1;
                    }
                    const priorityOrder = { high: 0, medium: 1, low: 2 };
                    return (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
                  })
                  .map(priority => (
                    <PriorityItem 
                      key={priority.id}
                      priority={priority}
                      onToggle={handleTogglePriority}
                      onEdit={handleEditPriority}
                      onDelete={handleDeletePriority}
                    />
                  ))}
              </ul>
            )}
          </>
        )}
      </div>
      
      {/* Daily Schedule */}
      <div className="px-4 mb-6" id="routine-section">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            Daily Routine
            <button 
              onClick={addNewRoutineItem} 
              className="text-black ml-2 text-sm"
              aria-label="Add routine item"
            >+</button>
          </h2>
        </div>
        
        {showRoutineSection && (
          <ClientOnly fallback={
            <div className="h-20 flex items-center justify-center">
              <p className="text-gray-400">Loading your routine...</p>
            </div>
          }>
            <>
              {/* Show different content depending on user's routine setup state */}
              {schedule.length > 0 ? (
                <div className="routine-container">
                  <div>
                    <ul>
                      {/* Sort the schedule by time */}
                      {[...schedule].sort((a, b) => {
                        // Helper function to convert time to minutes for comparison
                        const timeToMinutes = (timeStr) => {
                          if (!timeStr) return 0;
                          
                          const isPM = timeStr.includes('PM');
                          const timeOnly = timeStr.replace(/(AM|PM)/, '').trim();
                          let [hours, minutes] = timeOnly.split(':').map(Number);
                          
                          if (isPM && hours < 12) hours += 12;
                          if (!isPM && hours === 12) hours = 0;
                          
                          return hours * 60 + (minutes || 0);
                        };
                        
                        return timeToMinutes(a.time) - timeToMinutes(b.time);
                      }).map((item, index) => (
                        <ScheduleItem 
                          key={item.id}
                          item={item}
                          index={index}
                          onToggle={handleToggleScheduleItem}
                          onEdit={handleEditRoutineItem}
                          onDelete={handleDeleteRoutineItem}
                        />
                      ))}
                    </ul>
                  </div>
                  
                  {/* Reset routine button */}
                  <button 
                    onClick={resetRoutine}
                    className="text-xs text-gray-500 mt-4 mb-2 hover:text-blue-600 flex items-center justify-center w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset My Routine
                  </button>
                </div>
              ) : (
                /* If no routine is set up, show the DailyRoutine component with templates */
                <DailyRoutine 
                  routineItems={routineConfig?.routineItems || []}
                  onToggle={handleToggleScheduleItem}
                  onUpdateItem={handleSaveRoutine}
                />
              )}
              
              {/* Routine Editor Modal */}
              {showRoutineEditor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
                    <RoutineEditor 
                      routineItem={currentRoutineItem}
                      onSave={handleSaveRoutineItem}
                      onCancel={closeRoutineEditor}
                    />
                  </div>
                </div>
              )}
            </>
          </ClientOnly>
        )}
      </div>
      
      {/* Add Appointment Button */}
      <div className="px-4 mb-6">
        <button 
          onClick={handleAddAppointment}
          className="bg-black text-white py-4 px-6 rounded-full flex justify-between items-center w-full font-medium text-sm"
        >
          <span>ADD AN APPOINTMENT</span>
          <span className="text-sm">+</span>
        </button>
      </div>
      
      {/* Quick Access Grid */}
      <div id="quick-access" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 px-4 mb-6">
        {quickAccessItems.map(item => (
          <button 
            key={item.id} 
            className="border border-black rounded-lg p-4 flex flex-col justify-center items-center h-24 hover:bg-gray-50 transition-colors bg-white"
            onClick={() => handleQuickAccess(item)}
            aria-label={`Open ${item.name}`}
          >
            <span className="text-3xl mb-1">{item.emoji}</span>
            <span className="text-xs font-medium">{item.name}</span>
          </button>
        ))}
      </div>
      
      {/* Notes Input */}
      <div id="notes-section" className="px-4 mb-4">
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
      <div id="call-section" className="px-4 mb-8">
        <a 
          href="tel:+15551234567"
          className="block w-full bg-white border border-black rounded-full py-4 mb-3 font-medium text-center flex items-center justify-center text-sm"
        >
          <span className="mr-2">📞</span> Call Mike
        </a>
        <a 
          href="tel:+15552345678"
          className="block w-full bg-white border border-black rounded-full py-4 mb-3 font-medium text-center flex items-center justify-center text-sm"
        >
          <span className="mr-2">📞</span> Call Sarah
        </a>
        <a 
          href="tel:+15553456789"
          className="block w-full bg-white border border-black rounded-full py-4 font-medium text-center flex items-center justify-center text-sm"
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
      
      {/* Reset button - always visible during beta */}
      <div className="fixed bottom-2 right-2 z-10">
        <button 
          onClick={resetOnboarding}
          className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded"
        >
          Reset Onboarding
        </button>
      </div>
    </main>
  );
}

// Quote display component - separating this to use the hook
// The component is defined outside the main component to prevent re-rendering issues
const QuoteDisplay = React.memo(() => {
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
});
