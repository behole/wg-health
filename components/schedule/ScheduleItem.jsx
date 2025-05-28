'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const ScheduleItem = ({ item, onToggle, onEdit, onDelete, index = 0 }) => {
  const router = useRouter();
  const { id, time, activity, completed, hasDetails, isRoutine } = item;
  
  const getRoutineColor = (index) => {
    // Cycle through colors to match Figma
    const colors = ['bg-routine-yellow', 'bg-routine-red', 'bg-routine-blue', 'bg-routine-purple'];
    return colors[index % colors.length];
  };
  
  const handleViewDetails = () => {
    if (hasDetails) {
      // Using query params to avoid dynamic routes for static export
      router.push(`/details-static?id=${id}`);
    }
  };
  
  return (
    <li className="flex items-center py-2 mb-2">
      {/* Checkbox */}
      <button
        onClick={() => onToggle(id)}
        className={`w-4 h-4 rounded-full border border-black flex items-center justify-center mr-3 ${
          completed ? 'bg-orange' : 'bg-white'
        }`}
        aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
      />
      
      {/* Time block with routine color */}
      <div className={`${getRoutineColor(index)} px-2 py-1 mr-3`}>
        <span className="text-xs font-medium text-white">
          {time || '00:00'}
        </span>
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <span className={`text-sm font-medium ${completed ? 'line-through text-gray-500' : 'text-black'}`}>
          {activity}
          {isRoutine && (
            <span className="ml-2 text-xs text-blue-600 font-medium">routine</span>
          )}
        </span>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center space-x-1 ml-2">
        {hasDetails && (
          <button 
            onClick={handleViewDetails}
            className="text-xs text-blue-600"
            aria-label="View details"
          >
            +
          </button>
        )}
        
        {onEdit && (
          <button
            onClick={() => onEdit(item)}
            className="text-xs text-gray-500 hover:text-black"
            aria-label="Edit routine item"
          >
            ✏️
          </button>
        )}
        
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="text-xs text-gray-500 hover:text-red-600"
            aria-label="Delete routine item"
          >
            🗑️
          </button>
        )}
      </div>
    </li>
  );
};

export default ScheduleItem;
