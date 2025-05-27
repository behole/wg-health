'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const ScheduleItem = ({ item, onToggle, onEdit, onDelete }) => {
  const router = useRouter();
  const { id, time, activity, completed, hasDetails, isRoutine } = item;
  
  const getTimeBlockStyles = () => {
    if (time.includes('AM')) {
      // Morning hours - warm yellow like the timeline
      return 'bg-yellow-300 text-black';
    } else if (time.includes('PM') && parseInt(time) < 5) {
      // Afternoon hours - blue like midday in timeline
      return 'bg-blue-400 text-white';
    } else {
      // Evening hours - purple like the timeline evening
      return 'bg-purple-400 text-white';
    }
  };
  
  const handleViewDetails = () => {
    if (hasDetails) {
      // Using query params to avoid dynamic routes for static export
      router.push(`/details-static?id=${id}`);
    }
  };
  
  return (
    <li className={`flex items-center py-2 relative mb-2 ${isRoutine ? 'routine-item' : 'schedule-item'}`}>
      {/* Timeline dot - different style for routine vs non-routine */}
      <button
        onClick={() => onToggle(id)}
        className={`absolute left-0 w-4 h-4 rounded-full -ml-[7px] top-[calc(50%-8px)]
                    ${completed ? 'bg-black' : 'border-2 border-black bg-white'}
                    ${isRoutine ? 'border-blue-600' : ''}`}
        aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
      />
      
      {/* Time block */}
      <div className="min-w-16 ml-3 mr-2">
        <span className={`inline-block px-2 py-0.5 text-xs ${getTimeBlockStyles()}`}>
          {time}
        </span>
      </div>
      
      <span className={`priority-text flex-grow ${completed ? 'line-through' : ''}`}>
        {activity}
        {isRoutine && (
          <span className="ml-2 text-xs text-blue-600 font-medium">routine</span>
        )}
      </span>
      
      <div className="flex items-center ml-auto">
        {hasDetails && (
          <button 
            onClick={handleViewDetails}
            className="ml-2 text-blue-600"
            aria-label="View details"
          >
            <span className="text-xl">+</span>
          </button>
        )}
        
        {/* Edit button - only show for routine items */}
        {isRoutine && onEdit && (
          <button
            onClick={() => onEdit(item)}
            className="ml-2 text-gray-500 hover:text-gray-700"
            aria-label="Edit routine item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
        
        {/* Delete button - only show for routine items */}
        {isRoutine && onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="ml-2 text-gray-500 hover:text-red-600"
            aria-label="Delete routine item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </li>
  );
};

export default ScheduleItem;
