'use client';

import React, { memo, useMemo } from 'react';

interface TimelineBarProps {
  schedule: Array<{
    id: string;
    time: string;
    title: string;
    completed: boolean;
  }>;
  timezone?: string;
  wakeTime?: string; // e.g., "06:00"
  sleepTime?: string; // e.g., "22:00"
  className?: string;
}

const TimelineBar = memo<TimelineBarProps>(({
  schedule,
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  wakeTime = "06:00",
  sleepTime = "22:00",
  className = ""
}) => {
  const timelineData = useMemo(() => {
    // Convert time string to minutes since midnight
    const timeToMinutes = (timeStr: string): number => {
      if (!timeStr || typeof timeStr !== 'string') return 0;
      
      try {
        const isPM = timeStr.toLowerCase().includes('pm');
        const isAM = timeStr.toLowerCase().includes('am');
        let timeOnly = timeStr.replace(/(am|pm)/i, '').trim();
        
        // Handle cases where time might not have AM/PM (24-hour format)
        if (!isPM && !isAM) {
          timeOnly = timeStr;
        }
        
        const timeParts = timeOnly.split(':');
        if (timeParts.length < 2) return 0;
        
        const hours = parseInt(timeParts[0]) || 0;
        const minutes = parseInt(timeParts[1]) || 0;
        
        let adjustedHours = hours;
        
        if (isPM && hours < 12) adjustedHours += 12;
        if (isAM && hours === 12) adjustedHours = 0;
        
        // Ensure hours are within valid range
        adjustedHours = Math.max(0, Math.min(23, adjustedHours));
        const finalMinutes = Math.max(0, Math.min(59, minutes));
        
        return adjustedHours * 60 + finalMinutes;
      } catch (error) {
        console.warn('Error parsing time:', timeStr, error);
        return 0;
      }
    };

    const wakeMinutes = timeToMinutes(wakeTime);
    const sleepMinutes = timeToMinutes(sleepTime);
    
    // Handle overnight schedules (sleep time next day)
    const totalAwakeMinutes = sleepMinutes > wakeMinutes 
      ? sleepMinutes - wakeMinutes 
      : (24 * 60) - wakeMinutes + sleepMinutes;
    
    // Prevent division by zero
    if (totalAwakeMinutes <= 0) {
      return {
        progressPercentage: 0,
        scheduleMarkers: [],
        wakeTime,
        sleepTime,
        totalAwakeMinutes: 1, // Minimum to prevent division by zero
        currentTimePercentage: 0
      };
    }

    // Get current time
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    // Calculate how much of the day has passed (within awake hours)
    let elapsedAwakeMinutes = 0;
    if (currentMinutes >= wakeMinutes && currentMinutes <= sleepMinutes) {
      elapsedAwakeMinutes = currentMinutes - wakeMinutes;
    } else if (currentMinutes < wakeMinutes && sleepMinutes < wakeMinutes) {
      // Past midnight, before wake time
      elapsedAwakeMinutes = (24 * 60) - wakeMinutes + currentMinutes;
    } else if (currentMinutes > sleepMinutes && sleepMinutes < wakeMinutes) {
      // Past sleep time but before midnight
      elapsedAwakeMinutes = sleepMinutes - wakeMinutes;
    } else if (currentMinutes < wakeMinutes) {
      // Early morning, before wake time
      elapsedAwakeMinutes = 0;
    } else {
      // Past sleep time (same day)
      elapsedAwakeMinutes = totalAwakeMinutes;
    }

    const progressPercentage = Math.min(100, Math.max(0, (elapsedAwakeMinutes / totalAwakeMinutes) * 100));

    // Map schedule items to timeline positions
    const scheduleMarkers = (schedule || []).map(item => {
      if (!item || !item.time) {
        return {
          ...item,
          percentage: 0
        };
      }
      
      const itemMinutes = timeToMinutes(item.time);
      let positionFromWake = 0;
      
      if (itemMinutes >= wakeMinutes && itemMinutes <= sleepMinutes) {
        positionFromWake = itemMinutes - wakeMinutes;
      } else if (itemMinutes < wakeMinutes && sleepMinutes < wakeMinutes) {
        positionFromWake = (24 * 60) - wakeMinutes + itemMinutes;
      } else if (itemMinutes > sleepMinutes) {
        positionFromWake = Math.min(itemMinutes - wakeMinutes, totalAwakeMinutes);
      } else {
        positionFromWake = 0;
      }
      
      const percentage = totalAwakeMinutes > 0 ? (positionFromWake / totalAwakeMinutes) * 100 : 0;
      
      return {
        ...item,
        percentage: Math.max(0, Math.min(100, percentage || 0))
      };
    }).filter(item => item.id) // Filter out invalid items
    .sort((a, b) => (a.percentage || 0) - (b.percentage || 0));

    return {
      progressPercentage,
      scheduleMarkers,
      wakeTime,
      sleepTime,
      totalAwakeMinutes,
      currentTimePercentage: progressPercentage
    };
  }, [schedule, wakeTime, sleepTime, timezone]);

  const getTimeLabel = (percentage: number): string => {
    try {
      if (!timelineData || typeof percentage !== 'number' || isNaN(percentage)) {
        return '12:00 PM';
      }
      
      const totalMinutes = Math.max(0, (percentage / 100) * timelineData.totalAwakeMinutes);
      const wakeParts = timelineData.wakeTime.split(':');
      const wakeHours = parseInt(wakeParts[0]) || 0;
      const wakeMinutesInHour = parseInt(wakeParts[1]) || 0;
      const wakeMinutes = wakeHours * 60 + wakeMinutesInHour;
      const targetMinutes = wakeMinutes + totalMinutes;
      
      const hours = Math.floor((targetMinutes % (24 * 60)) / 60);
      const minutes = Math.floor(targetMinutes % 60);
      
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    } catch (error) {
      console.warn('Error in getTimeLabel:', error);
      return '12:00 PM';
    }
  };

  // Don't render if we don't have valid timeline data
  if (!timelineData || timelineData.totalAwakeMinutes <= 0) {
    return <div className={`relative ${className}`} />;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Background timeline */}
      <div className="absolute left-2 top-0 bottom-0 w-1 bg-gray-200 rounded-full"></div>
      
      {/* Current time progress */}
      <div 
        className="absolute left-2 top-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
        style={{ 
          height: `${timelineData.progressPercentage}%`
        }}
      >
        {/* Current time indicator */}
        <div 
          className="absolute -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-sm"
          style={{ 
            top: '100%',
            transform: 'translateY(-50%)'
          }}
        />
      </div>

      {/* Schedule markers */}
      {timelineData.scheduleMarkers.map((marker, index) => (
        <div
          key={marker.id}
          className="absolute left-0 w-5 h-5 flex items-center justify-center"
          style={{
            top: `${marker.percentage}%`,
            transform: 'translateY(-50%)'
          }}
        >
          <div 
            className={`w-2 h-2 rounded-full border-2 border-white shadow-sm transition-all duration-200 ${
              marker.completed 
                ? 'bg-green-500' 
                : 'bg-gray-400 hover:bg-gray-500'
            }`}
            title={`${marker.time} - ${marker.title}`}
          />
        </div>
      ))}

      {/* Wake/Sleep time labels */}
      <div className="absolute left-6 top-0 text-xs text-gray-500 font-medium">
        {timelineData.wakeTime} Wake
      </div>
      <div className="absolute left-6 bottom-0 text-xs text-gray-500 font-medium">
        {timelineData.sleepTime} Sleep
      </div>

      {/* Current time label */}
      <div 
        className="absolute left-6 text-xs text-blue-600 font-medium bg-white px-1 rounded"
        style={{
          top: `${timelineData.currentTimePercentage}%`,
          transform: 'translateY(-50%)'
        }}
      >
        {getTimeLabel(timelineData.currentTimePercentage)}
      </div>
    </div>
  );
});

TimelineBar.displayName = 'TimelineBar';

export default TimelineBar;