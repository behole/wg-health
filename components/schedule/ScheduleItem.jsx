'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const ScheduleItem = ({ item, onToggle }) => {
  const router = useRouter();
  const { id, time, activity, completed, hasDetails } = item;
  
  const getTimeBlockStyles = () => {
    if (time.includes('AM')) {
      return 'bg-yellow-400 text-black';
    } else if (time.includes('PM') && parseInt(time) < 5) {
      return 'bg-red-400 text-black';
    } else {
      return 'bg-purple-500 text-white';
    }
  };
  
  const handleViewDetails = () => {
    if (hasDetails) {
      // Using query params to avoid dynamic routes for static export
      router.push(`/details-static?id=${id}`);
    }
  };
  
  return (
    <li className="flex items-center py-2 relative mb-2">
      {/* Timeline dot */}
      <button
        onClick={() => onToggle(id)}
        className={`absolute left-0 w-4 h-4 rounded-full -ml-[7px] top-[calc(50%-8px)]
                    ${completed ? 'bg-black' : 'border-2 border-black bg-white'}`}
        aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
      />
      
      {/* Time block */}
      <div className="min-w-16 ml-3 mr-2">
        <span className={`inline-block px-2 py-0.5 text-xs ${getTimeBlockStyles()}`}>
          {time}
        </span>
      </div>
      
      <span className={`priority-text ${completed ? 'line-through' : ''}`}>{activity}</span>
      
      {hasDetails && (
        <button 
          onClick={handleViewDetails}
          className="ml-2 text-purple-600"
          aria-label="View details"
        >
          +
        </button>
      )}
    </li>
  );
};

export default ScheduleItem;
