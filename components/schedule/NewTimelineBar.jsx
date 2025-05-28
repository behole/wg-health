'use client';

import React from 'react';

const NewTimelineBar = ({ schedule = [], wakeTime = "06:00", sleepTime = "22:00", className = "" }) => {
  return (
    <div className="flex flex-col items-center" style={{width: '20px'}}>
      {/* Simple vertical timeline line */}
      <div 
        className="w-1 bg-black flex-1"
        style={{ minHeight: schedule.length > 0 ? `${schedule.length * 60}px` : '300px' }}
      ></div>
    </div>
  );
};

export default NewTimelineBar;