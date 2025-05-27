'use client';

import React from 'react';

interface DebugTimelineBarProps {
  className?: string;
}

const DebugTimelineBar: React.FC<DebugTimelineBarProps> = ({ className = "" }) => {
  return (
    <div className={`${className} bg-yellow-100 border-2 border-red-500`}>
      <div className="text-xs text-red-600 p-1">DEBUG TIMELINE</div>
      
      {/* Simple visible timeline */}
      <div className="relative h-64 bg-blue-50 mx-2 my-2">
        {/* Background bar */}
        <div className="absolute left-2 top-2 bottom-2 w-3 bg-gray-400 rounded"></div>
        
        {/* Progress bar */}
        <div className="absolute left-2 top-2 w-3 h-1/2 bg-blue-500 rounded"></div>
        
        {/* Current time dot */}
        <div className="absolute left-1 top-1/2 w-5 h-5 bg-red-500 rounded-full border-2 border-white"></div>
        
        {/* Labels */}
        <div className="absolute left-8 top-2 text-xs">Wake: 6:00 AM</div>
        <div className="absolute left-8 bottom-2 text-xs">Sleep: 10:00 PM</div>
        <div className="absolute left-8 top-1/2 text-xs text-blue-600">Current Time</div>
      </div>
    </div>
  );
};

export default DebugTimelineBar;