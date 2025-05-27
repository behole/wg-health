'use client';

import React, { memo, useCallback } from 'react';
import { PriorityItem as PriorityItemType } from '../../types';
import { Button } from '@/components/ui';

interface PriorityItemProps {
  priority: PriorityItemType;
  onToggle: (id: string) => void;
  onEdit?: (priority: PriorityItemType) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const PriorityItem = memo<PriorityItemProps>(({ 
  priority, 
  onToggle, 
  onEdit, 
  onDelete,
  className = '' 
}) => {
  const handleToggle = useCallback(() => {
    onToggle(priority.id);
  }, [priority.id, onToggle]);

  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit(priority);
    }
  }, [priority, onEdit]);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete(priority.id);
    }
  }, [priority.id, onDelete]);

  const getPriorityColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (level: string) => {
    switch (level) {
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

  const isOverdue = priority.dueDate && new Date(priority.dueDate) < new Date();

  return (
    <div 
      className={`
        flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200
        ${priority.completed ? 'bg-gray-50 opacity-75' : 'bg-white hover:shadow-md'}
        ${isOverdue && !priority.completed ? 'border-red-300' : 'border-gray-200'}
        ${className}
      `.trim()}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={`
          w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
          ${priority.completed 
            ? 'bg-blue-600 border-blue-600 text-white' 
            : 'border-gray-300 hover:border-blue-400'
          }
        `.trim()}
        aria-label={`Mark "${priority.text}" as ${priority.completed ? 'incomplete' : 'complete'}`}
      >
        {priority.completed && (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path 
              fillRule="evenodd" 
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          {/* Priority Badge */}
          <span className={`
            inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
            ${getPriorityColor(priority.priority)}
          `.trim()}>
            <span className="mr-1" role="img" aria-label={`${priority.priority} priority`}>
              {getPriorityIcon(priority.priority)}
            </span>
            {priority.priority}
          </span>

          {/* Overdue Badge */}
          {isOverdue && !priority.completed && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-red-700 bg-red-100 border border-red-200">
              ⏰ Overdue
            </span>
          )}
        </div>

        {/* Task Text */}
        <p 
          className={`
            text-sm font-medium transition-all duration-200
            ${priority.completed 
              ? 'line-through text-gray-500' 
              : 'text-gray-900'
            }
          `.trim()}
        >
          {priority.text}
        </p>

        {/* Due Date */}
        {priority.dueDate && (
          <p className={`
            text-xs mt-1
            ${isOverdue && !priority.completed 
              ? 'text-red-600 font-medium' 
              : 'text-gray-500'
            }
          `.trim()}>
            Due: {new Date(priority.dueDate).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-1">
        {onEdit && (
          <Button
            variant="tertiary"
            size="small"
            onClick={handleEdit}
            ariaLabel={`Edit "${priority.text}"`}
            className="p-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
        )}

        {onDelete && (
          <Button
            variant="danger"
            size="small"
            onClick={handleDelete}
            ariaLabel={`Delete "${priority.text}"`}
            className="p-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
});

PriorityItem.displayName = 'PriorityItem';

export default PriorityItem;