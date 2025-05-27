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

  return (
    <div className="relative flex flex-col items-center h-full" style={{width: '30px'}}>
      {/* Main timeline container - fills full height */}
      <div className="relative flex-1 w-5">
        {/* Background timeline with morning to night gradient */}
        <div 
          className="absolute inset-0 w-full rounded-full shadow-inner"
          style={{
            background: `linear-gradient(to bottom, 
              #fef3c7 0%,    /* Morning - warm yellow */
              #fcd34d 20%,   /* Late morning - bright yellow */
              #3b82f6 50%,   /* Midday - blue sky */
              #1d4ed8 70%,   /* Afternoon - deeper blue */
              #7c3aed 90%,   /* Evening - purple */
              #1f2937 100%   /* Night - dark */
            )`
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
            <div className="w-6 h-6 bg-white rounded-full border-2 border-gray-800 shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewTimelineBar;