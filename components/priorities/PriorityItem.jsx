'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const PriorityItem = ({ priority, onToggle, onEdit, onDelete }) => {
  const router = useRouter();
  const { id, text, completed, time, hasDetails, priority: priorityLevel } = priority;
  
  const getPriorityColor = () => {
    switch(priorityLevel) {
      case 'high':
        return 'bg-priority-high';
      case 'medium':
        return 'bg-priority-medium';
      case 'low':
        return 'bg-priority-low';
      default:
        return 'bg-gray-300';
    }
  };

  const getPriorityLabel = () => {
    switch(priorityLevel) {
      case 'high':
        return 'HIGH';
      case 'medium':
        return 'MEDIUM';
      case 'low':
        return 'LOW';
      default:
        return '';
    }
  };
  
  const handleViewDetails = () => {
    if (hasDetails) {
      // Using query params to avoid dynamic routes for static export
      router.push(`/details-static?id=${id}`);
    }
  };
  
  return (
    <li className="flex items-center py-2 mb-1">
      {/* Checkbox */}
      <button 
        onClick={() => onToggle(id)}
        className={`w-4 h-4 rounded-full border border-black flex items-center justify-center mr-2 ${
          completed ? 'bg-orange' : 'bg-white'
        }`}
        aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
      >
      </button>

      {/* Priority indicator rectangle */}
      <div className={`w-4 h-4 ${getPriorityColor()} mr-2`}></div>
      
      {/* Priority label */}
      <div className={`${getPriorityColor()} px-2 py-1 mr-3`}>
        <span className="text-xs font-medium text-black">
          {getPriorityLabel()}
        </span>
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <span className={`text-sm font-medium ${
          completed ? 'line-through text-gray-500' : 'text-black'
        }`}>
          {text}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-1 ml-2">
        {onEdit && (
          <button
            onClick={() => onEdit(priority)}
            className="text-xs text-gray-500 hover:text-black"
            aria-label="Edit priority"
          >
            ✏️
          </button>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="text-xs text-gray-500 hover:text-red-600"
            aria-label="Delete priority"
          >
            🗑️
          </button>
        )}
      </div>
    </li>
  );
};

export default PriorityItem;
