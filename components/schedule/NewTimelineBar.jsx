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
    <div className="relative" style={{width: '80px', height: '400px'}}>
      {/* Background timeline */}
      <div className="absolute left-2 top-2 bottom-2 w-2 bg-gray-300 rounded-full" />
      
      {/* Progress fill */}
      <div 
        className="absolute left-2 top-2 w-2 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"
        style={{ height: `${(progressPercentage / 100) * (100 - 4)}%` }}
      />

      {/* Current time indicator */}
      <div 
        className="absolute left-1 w-4 h-4 flex items-center justify-center"
        style={{
          top: `${2 + (progressPercentage / 100) * (100 - 4)}%`,
          transform: 'translateY(-50%)'
        }}
      >
        <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-md" />
      </div>

      {/* Schedule item dots */}
      {schedule.map((item, index) => {
        const position = ((index + 1) / (schedule.length + 1)) * 100;
        return (
          <div
            key={item.id}
            className="absolute left-1 w-4 h-4 flex items-center justify-center"
            style={{
              top: `${position}%`,
              transform: 'translateY(-50%)'
            }}
          >
            <div 
              className={`w-2 h-2 rounded-full border border-white shadow-sm ${
                item.completed ? 'bg-green-500' : 'bg-gray-400'
              }`}
              title={`${item.time} - ${item.title}`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default NewTimelineBar;