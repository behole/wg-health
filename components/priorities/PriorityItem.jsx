'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const PriorityItem = ({ priority, onToggle }) => {
  const router = useRouter();
  const { id, text, completed, time, hasDetails } = priority;
  
  const getTimeStyles = () => {
    switch(time) {
      case 'Morning':
        return 'bg-yellow-400 text-black';
      case 'Afternoon':
        return 'bg-red-400 text-white';
      case 'Evening':
        return 'bg-purple-600 text-white';
      case 'Night':
        return 'bg-black text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };
  
  const handleViewDetails = () => {
    if (hasDetails) {
      // Using query params to avoid dynamic routes for static export
      router.push(`/details-static?id=${id}`);
    }
  };
  
  return (
    <li className={`flex items-center py-2 mb-2 ${completed ? 'priority-complete' : ''}`}>
      <button 
        onClick={() => onToggle(id)}
        className={`w-4 h-4 rounded-full mr-2 flex-shrink-0 
                  ${completed ? 'bg-black' : 'border-2 border-black'}`}
        aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
      />
      
      {time && (
        <span className={`text-xs text-white px-2 py-0.5 mr-2 ${getTimeStyles()}`}>
          {time}
        </span>
      )}
      
      <span className="priority-text">{text}</span>
      
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

export default PriorityItem;
