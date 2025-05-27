'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const PriorityItem = ({ priority, onToggle, onEdit, onDelete }) => {
  const router = useRouter();
  const { id, text, completed, time, hasDetails, priority: priorityLevel } = priority;
  
  const getTimeStyles = () => {
    switch(time) {
      case 'Morning':
        return 'bg-yellow-300 text-black';
      case 'Afternoon':
        return 'bg-blue-400 text-white';
      case 'Evening':
        return 'bg-purple-400 text-white';
      case 'Night':
        return 'bg-gray-800 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getPriorityStyles = () => {
    switch(priorityLevel) {
      case 'high':
        return 'border-l-4 border-red-400 bg-red-50';
      case 'medium':
        return 'border-l-4 border-yellow-400 bg-yellow-50';
      case 'low':
        return 'border-l-4 border-green-400 bg-green-50';
      default:
        return 'border-l-4 border-gray-300 bg-gray-50';
    }
  };

  const getPriorityIcon = () => {
    switch(priorityLevel) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };
  
  const handleViewDetails = () => {
    if (hasDetails) {
      router.push(`/details-static?id=${id}`);
    }
  };
  
  return (
    <li className={`rounded-lg p-3 mb-3 transition-all duration-200 hover:shadow-md ${getPriorityStyles()} ${completed ? 'opacity-75 bg-gray-100' : ''}`}>
      <div className="flex items-center">
        {/* Checkbox */}
        <button 
          onClick={() => onToggle(id)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-all duration-200 ${
            completed 
              ? 'bg-blue-600 border-blue-600 text-white' 
              : 'border-gray-400 hover:border-blue-500'
          }`}
          aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {completed && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Priority icon */}
        {priorityLevel && (
          <span className="mr-2 text-sm" title={`${priorityLevel} priority`}>
            {getPriorityIcon()}
          </span>
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <span className={`block font-medium transition-all duration-200 ${
            completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {text}
          </span>
          
          {/* Time tag */}
          {time && (
            <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${getTimeStyles()}`}>
              {time}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-1 ml-2">
          {hasDetails && (
            <button 
              onClick={handleViewDetails}
              className="p-1 text-blue-600 hover:text-blue-800 transition-colors" 
              aria-label="View details"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}

          {onEdit && (
            <button
              onClick={() => onEdit(priority)}
              className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
              aria-label="Edit priority"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="p-1 text-gray-500 hover:text-red-600 transition-colors"
              aria-label="Delete priority"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

export default PriorityItem;
