'use client';

import React from 'react';

const NewTimelineBar = ({ schedule = [], wakeTime = "06:00", sleepTime = "22:00", className = "" }) => {
  // Get current time
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Convert times to numbers for easier calculation
  const wakeHour = parseInt(wakeTime.split(':')[0]);
  const sleepHour = parseInt(sleepTime.split(':')[0]);
  
  // Calculate total awake hours (simplified - same day only for now)
  const totalAwakeHours = sleepHour > wakeHour ? sleepHour - wakeHour : 16; // default 16 hours
  
  // Calculate progress through the day
  let progressHours = 0;
  if (currentHour >= wakeHour && currentHour <= sleepHour) {
    progressHours = currentHour - wakeHour + (currentMinute / 60);
  } else if (currentHour > sleepHour) {
    progressHours = totalAwakeHours; // Past sleep time
  }
  
  const progressPercentage = Math.min(100, (progressHours / totalAwakeHours) * 100);

  // Helper function to get time label
  const getTimeLabel = (hour) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  return (
    <div className="relative flex flex-col items-center py-2" style={{width: '80px'}}>
      {/* Title and time range */}
      <div className="text-center mb-3">
        <div className="text-xs font-medium text-gray-700 mb-1">Your Day</div>
        <div className="text-xs text-gray-500">
          {getTimeLabel(wakeHour)} - {getTimeLabel(sleepHour)}
        </div>
      </div>

      {/* Main timeline container */}
      <div className="relative" style={{width: '20px', height: '300px'}}>
        {/* Background timeline with day gradient */}
        <div 
          className="absolute inset-x-0 top-0 bottom-0 w-full rounded-full shadow-inner"
          style={{
            background: `linear-gradient(to bottom, 
              #fef3c7 0%,    /* Dawn - warm yellow */
              #fcd34d 15%,   /* Morning - bright yellow */
              #f59e0b 30%,   /* Late morning - amber */
              #3b82f6 50%,   /* Midday - blue sky */
              #1d4ed8 70%,   /* Afternoon - deeper blue */
              #7c3aed 85%,   /* Evening - purple */
              #1f2937 100%   /* Night - dark */
            )`
          }}
        />
        
        {/* Progress overlay */}
        <div 
          className="absolute inset-x-0 top-0 w-full bg-black bg-opacity-20 rounded-full"
          style={{ 
            height: `${(1 - progressPercentage / 100) * 100}%`,
            marginTop: `${progressPercentage}%`
          }}
        />

        {/* Current time indicator */}
        {progressPercentage <= 100 && (
          <div 
            className="absolute -left-1 -right-1 flex items-center justify-center"
            style={{
              top: `${progressPercentage}%`,
              transform: 'translateY(-50%)'
            }}
          >
            <div className="flex items-center">
              <div className="w-1 h-1 bg-white rounded-full mr-1" />
              <div className="w-6 h-6 bg-white rounded-full border-2 border-gray-800 shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
              </div>
              <div className="w-1 h-1 bg-white rounded-full ml-1" />
            </div>
            
            {/* Current time label */}
            <div className="absolute left-8 text-xs font-medium text-gray-800 bg-white px-2 py-1 rounded shadow whitespace-nowrap">
              Now: {currentHour}:{currentMinute.toString().padStart(2, '0')}
            </div>
          </div>
        )}

        {/* Hour markers */}
        {Array.from({ length: Math.floor(totalAwakeHours / 4) + 1 }, (_, i) => {
          const hour = wakeHour + (i * 4);
          if (hour > sleepHour) return null;
          
          const position = ((hour - wakeHour) / totalAwakeHours) * 100;
          return (
            <div
              key={hour}
              className="absolute -right-1 flex items-center"
              style={{
                top: `${position}%`,
                transform: 'translateY(-50%)'
              }}
            >
              <div className="w-3 h-0.5 bg-white bg-opacity-80" />
              <div className="text-xs text-gray-600 ml-2 font-medium">
                {getTimeLabel(hour)}
              </div>
            </div>
          );
        })}

        {/* Schedule item indicators */}
        {schedule.map((item, index) => {
          // Try to position based on actual time if available
          let position = ((index + 1) / (schedule.length + 1)) * 100;
          
          // Better positioning logic if we can parse the time
          if (item.time) {
            try {
              const timeStr = item.time.toString();
              const isPM = timeStr.includes('PM');
              const timeOnly = timeStr.replace(/(AM|PM)/, '').trim();
              let [hours, minutes = 0] = timeOnly.split(':').map(Number);
              
              if (isPM && hours < 12) hours += 12;
              if (!isPM && hours === 12) hours = 0;
              
              if (hours >= wakeHour && hours <= sleepHour) {
                position = ((hours - wakeHour + minutes / 60) / totalAwakeHours) * 100;
              }
            } catch (e) {
              // Fall back to even spacing
            }
          }
          
          return (
            <div
              key={item.id}
              className="absolute -left-2 -right-2 flex items-center justify-center"
              style={{
                top: `${position}%`,
                transform: 'translateY(-50%)'
              }}
            >
              <div 
                className={`w-4 h-4 rounded-full border-2 border-white shadow-md flex items-center justify-center ${
                  item.completed 
                    ? 'bg-green-500' 
                    : 'bg-orange-400 hover:bg-orange-500'
                }`}
                title={`${item.time} - ${item.title}`}
              >
                {item.completed && (
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="text-center mt-3">
        <div className="text-xs text-gray-500 mb-1">🌅 → 🌙</div>
        <div className="text-xs text-gray-400">Dawn to Night</div>
      </div>
    </div>
  );
};

export default NewTimelineBar;