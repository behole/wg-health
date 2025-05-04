'use client';

import React, { useState } from 'react';
import ScheduleItem from './ScheduleItem';

// Routine templates that users can choose from
const routineTemplates = {
  simple: [
    { time: '6 AM', activity: 'Wake Up' },
    { time: '7 AM', activity: 'Breakfast' },
    { time: '8 AM', activity: 'Walk the Dogs' },
    { time: '12 PM', activity: 'Lunch' },
    { time: '2 PM', activity: 'Walk the Dogs' },
    { time: '6 PM', activity: 'Dinner' },
    { time: '9 PM', activity: 'Medication' },
    { time: '10 PM', activity: 'Bedtime' }
  ],
  detailed: [
    { time: '6 AM', activity: 'Wake Up' },
    { time: '6:30 AM', activity: 'Morning Meditation', hasDetails: true },
    { time: '7 AM', activity: 'Breakfast' },
    { time: '7:30 AM', activity: 'Take Morning Medications', hasDetails: true },
    { time: '8 AM', activity: 'Walk the Dogs' },
    { time: '9 AM', activity: 'Household Chores', hasDetails: true },
    { time: '10 AM', activity: 'Coffee Break' },
    { time: '11 AM', activity: 'Hobby Time', hasDetails: true },
    { time: '12 PM', activity: 'Lunch' },
    { time: '1 PM', activity: 'Rest Time' },
    { time: '2 PM', activity: 'Walk the Dogs' },
    { time: '3 PM', activity: 'Free Time' },
    { time: '5 PM', activity: 'Dinner Preparation', hasDetails: true },
    { time: '6 PM', activity: 'Dinner' },
    { time: '7 PM', activity: 'Family Time' },
    { time: '8 PM', activity: 'Evening Relaxation' },
    { time: '9 PM', activity: 'Medication', hasDetails: true },
    { time: '10 PM', activity: 'Bedtime Routine', hasDetails: true }
  ],
  active: [
    { time: '5:30 AM', activity: 'Wake Up' },
    { time: '6 AM', activity: 'Morning Exercise', hasDetails: true },
    { time: '7 AM', activity: 'Shower & Get Ready' },
    { time: '7:30 AM', activity: 'Breakfast' },
    { time: '8 AM', activity: 'Walk the Dogs' },
    { time: '9 AM', activity: 'Errands/Shopping', hasDetails: true },
    { time: '11 AM', activity: 'Garden/Outdoor Activity', hasDetails: true },
    { time: '12:30 PM', activity: 'Lunch' },
    { time: '1:30 PM', activity: 'Social Activity/Club', hasDetails: true },
    { time: '3 PM', activity: 'Walk the Dogs' },
    { time: '4 PM', activity: 'Afternoon Exercise', hasDetails: true },
    { time: '5:30 PM', activity: 'Dinner Preparation' },
    { time: '6:30 PM', activity: 'Dinner' },
    { time: '7:30 PM', activity: 'Evening Walk' },
    { time: '8:30 PM', activity: 'Medication & Wind Down', hasDetails: true },
    { time: '9:30 PM', activity: 'Bedtime' }
  ]
};

const DailyRoutine = ({ 
  routineItems = [], 
  onToggle, 
  onAddItem, 
  onUpdateItem,
  onDeleteItem 
}) => {
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Initialize routine with existing items or a default template
  const hasItems = routineItems && routineItems.length > 0;

  const applyTemplate = (templateName) => {
    if (!routineTemplates[templateName]) return;
    
    // Create new routine items from template with IDs
    const newItems = routineTemplates[templateName].map((item, index) => ({
      id: `routine-${Date.now()}-${index}`,
      time: item.time,
      activity: item.activity,
      completed: false,
      hasDetails: item.hasDetails || false,
      isRoutine: true
    }));
    
    // Add all template items at once
    onUpdateItem(newItems);
    
    // Close template selector
    setShowTemplateSelector(false);
  };

  return (
    <div className="daily-routine">
      {/* Template selector shows when user has no routine or clicks change template */}
      {(showTemplateSelector || !hasItems) && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="font-bold text-lg mb-3">Select a Daily Routine Template</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <button
              className={`p-3 border-2 rounded-lg text-left ${
                selectedTemplate === 'simple' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
              }`}
              onClick={() => setSelectedTemplate('simple')}
            >
              <div className="font-bold mb-1">Simple</div>
              <div className="text-sm text-gray-600">8 basic daily activities</div>
            </button>
            
            <button
              className={`p-3 border-2 rounded-lg text-left ${
                selectedTemplate === 'detailed' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
              }`}
              onClick={() => setSelectedTemplate('detailed')}
            >
              <div className="font-bold mb-1">Detailed</div>
              <div className="text-sm text-gray-600">18 activities with detailed schedule</div>
            </button>
            
            <button
              className={`p-3 border-2 rounded-lg text-left ${
                selectedTemplate === 'active' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
              }`}
              onClick={() => setSelectedTemplate('active')}
            >
              <div className="font-bold mb-1">Active</div>
              <div className="text-sm text-gray-600">16 activities with exercise focus</div>
            </button>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => setShowTemplateSelector(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
              disabled={!hasItems}
            >
              Cancel
            </button>
            
            <button
              onClick={() => applyTemplate(selectedTemplate)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:bg-gray-300"
              disabled={!selectedTemplate}
            >
              Apply Template
            </button>
          </div>
        </div>
      )}
      
      {/* Routine Display */}
      {hasItems && !showTemplateSelector && (
        <div className="routine-list relative">
          {/* Template change button */}
          <button
            onClick={() => setShowTemplateSelector(true)}
            className="text-xs text-purple-600 mb-3 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Change Template
          </button>
          
          {/* Vertical timeline line with progress */}
          <div className="absolute left-2 top-0 bottom-0 w-1 bg-gray-200"></div>
          
          {/* Progress bar overlay */}
          {routineItems.length > 0 && (
            <div 
              className="absolute left-2 top-0 w-1 bg-yellow-400" 
              style={{ 
                height: `${(routineItems.filter(item => item.completed).length / routineItems.length) * 100}%` 
              }}
            ></div>
          )}
          
          <ul className="pl-6">
            {routineItems.map(item => (
              <ScheduleItem 
                key={item.id}
                item={item}
                onToggle={onToggle}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DailyRoutine;