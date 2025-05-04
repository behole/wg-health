'use client';

import React, { useState } from 'react';
import OnboardingIllustration from './OnboardingIllustration';

const RoutineSetupStep = ({ onSave, onSkip }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [wakeupTime, setWakeupTime] = useState('7:00 AM');
  const [bedTime, setBedTime] = useState('10:00 PM');
  const [hasPets, setHasPets] = useState(false);
  const [takeMedication, setTakeMedication] = useState(false);
  
  // Common time options for easier selection
  const morningTimes = [
    '5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', 
    '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM'
  ];
  
  const eveningTimes = [
    '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', 
    '9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
  ];
  
  // Routine templates - we'll use these as a base and customize them
  const routineTemplates = {
    relaxed: "A relaxed pace with plenty of rest time",
    balanced: "A balanced mix of activities and rest",
    active: "An active schedule with regular exercise"
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedTemplate) {
      alert('Please select a routine template');
      return;
    }
    
    // Create customized routine based on template and user preferences
    let routineItems = [];
    
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
        activity: 'Walk the Dogs',
        completed: false,
        isRoutine: true
      });
      
      routineItems.push({
        id: `routine-${Date.now()}-5`,
        time: '2:00 PM',
        activity: 'Afternoon Pet Care',
        completed: false,
        isRoutine: true
      });
      
      routineItems.push({
        id: `routine-${Date.now()}-6`,
        time: '6:30 PM',
        activity: 'Evening Dog Walk',
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
          time: '1:30 PM',
          activity: 'Household Tasks',
          completed: false,
          isRoutine: true
        },
        {
          id: `routine-${Date.now()}-10`,
          time: '3:30 PM',
          activity: 'Social or Hobby Time',
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
          time: '2:00 PM',
          activity: 'Afternoon Activity',
          completed: false,
          isRoutine: true
        },
        {
          id: `routine-${Date.now()}-10`,
          time: '4:30 PM',
          activity: 'Exercise/Walk',
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
        time: '7:30 PM',
        activity: 'Evening Relaxation',
        completed: false,
        isRoutine: true
      },
      {
        id: `routine-${Date.now()}-13`,
        time: subtractMinutesFromTime(bedTime, 30),
        activity: 'Bedtime Routine',
        hasDetails: true,
        details: 'Prepare for sleep: brush teeth, change clothes, etc.',
        completed: false,
        isRoutine: true
      },
      {
        id: `routine-${Date.now()}-14`,
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
    
    // Save the routine
    onSave({
      routineType: selectedTemplate,
      wakeupTime,
      bedTime,
      hasPets,
      takeMedication,
      routineItems
    });
  };
  
  // Helper function to add minutes to a time string like "7:00 AM"
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
  
  // Helper function to subtract minutes from a time string
  function subtractMinutesFromTime(timeString, minutesToSubtract) {
    return addMinutesToTime(timeString, -minutesToSubtract);
  }
  
  // Helper function to convert time string to minutes for sorting
  function convertTimeToMinutes(timeString) {
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    let totalHours = hours;
    if (period === 'PM' && hours < 12) totalHours += 12;
    if (period === 'AM' && hours === 12) totalHours = 0;
    
    return totalHours * 60 + minutes;
  }
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-3 text-center">Set Up Your Daily Routine</h2>
      <p className="text-sm text-center mb-4">This will help you keep track of regular activities throughout your day.</p>
      
      <OnboardingIllustration type="daily" />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Your Routine Type
          </label>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(routineTemplates).map(([key, description]) => (
              <button
                key={key}
                type="button"
                className={`p-3 border-2 rounded-lg text-left transition-colors ${
                  selectedTemplate === key 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-300 hover:border-purple-200'
                }`}
                onClick={() => setSelectedTemplate(key)}
              >
                <div className="font-medium mb-1 capitalize">{key}</div>
                <div className="text-sm text-gray-600">{description}</div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
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
        
        <div className="space-y-2">
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
        
        <div className="text-xs text-gray-500 italic">
          Your routine will be customized based on these preferences. You can always adjust it later.
        </div>
        
        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={onSkip}
            className="px-4 py-2 text-gray-500 hover:text-gray-700"
          >
            Skip
          </button>
          
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-300"
            disabled={!selectedTemplate}
          >
            Create My Routine
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoutineSetupStep;