'use client';

import React, { memo, useMemo } from 'react';

interface SimpleTimelineBarProps {
  schedule?: Array<{
    id: string;
    time: string;
    title: string;
    completed: boolean;
  }>;
  wakeTime?: string;
  sleepTime?: string;
  className?: string;
}

const SimpleTimelineBar = memo<SimpleTimelineBarProps>(({
  schedule = [],
  wakeTime = "06:00",
  sleepTime = "22:00",
  className = ""
}) => {
  const timelineData = useMemo(() => {
    // Convert HH:MM to minutes since midnight
    const parseTime = (timeStr: string): number => {
      if (!timeStr) return 0;
      const [hours, minutes] = timeStr.split(':').map(num => parseInt(num) || 0);
      return Math.max(0, Math.min(1439, hours * 60 + minutes)); // Clamp to valid day range
    };

    const wakeMinutes = parseTime(wakeTime);
    const sleepMinutes = parseTime(sleepTime);
    
    // Calculate total awake time (handle overnight schedules)
    const totalAwakeMinutes = sleepMinutes > wakeMinutes 
      ? sleepMinutes - wakeMinutes 
      : (1440 - wakeMinutes) + sleepMinutes; // 1440 = 24 * 60

    // Prevent division by zero
    if (totalAwakeMinutes <= 0) return null;

    // Get current time
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    // Calculate progress through awake day
    let progressMinutes = 0;
    if (sleepMinutes > wakeMinutes) {
      // Same day schedule
      if (currentMinutes >= wakeMinutes && currentMinutes <= sleepMinutes) {
        progressMinutes = currentMinutes - wakeMinutes;
      } else if (currentMinutes > sleepMinutes) {
        progressMinutes = totalAwakeMinutes; // Past sleep time
      }
      // Before wake time = 0 progress
    } else {
      // Overnight schedule
      if (currentMinutes >= wakeMinutes) {
        progressMinutes = currentMinutes - wakeMinutes;
      } else if (currentMinutes <= sleepMinutes) {
        progressMinutes = (1440 - wakeMinutes) + currentMinutes;
      } else {
        progressMinutes = totalAwakeMinutes; // Between sleep and wake
      }
    }

    const progressPercentage = Math.min(100, (progressMinutes / totalAwakeMinutes) * 100);

    return {
      progressPercentage,
      totalAwakeMinutes,
      wakeTime,
      sleepTime
    };
  }, [wakeTime, sleepTime]);

  // Don't render if invalid data
  if (!timelineData) {
    return <div className={className} />;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Background timeline */}
      <div className="absolute left-2 top-0 w-2 h-full bg-gray-300 rounded-full" />
      
      {/* Progress fill */}
      <div 
        className="absolute left-2 top-0 w-2 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full transition-all duration-1000"
        style={{ height: `${timelineData.progressPercentage}%` }}
      />

      {/* Current time indicator */}
      <div 
        className="absolute left-1 w-4 h-4 flex items-center justify-center"
        style={{
          top: `${timelineData.progressPercentage}%`,
          transform: 'translateY(-50%)'
        }}
      >
        <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-md" />
      </div>

      {/* Schedule items (simplified) */}
      {schedule.map((item, index) => {
        // Simple positioning based on array index for now
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
});

SimpleTimelineBar.displayName = 'SimpleTimelineBar';

export default SimpleTimelineBar;