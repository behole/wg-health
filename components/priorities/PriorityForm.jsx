'use client';

import React, { useState, useEffect } from 'react';

const PriorityForm = ({ priority = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    text: '',
    priority: 'medium',
    time: '',
    hasDetails: false
  });

  useEffect(() => {
    if (priority) {
      setFormData({
        text: priority.text || '',
        priority: priority.priority || 'medium',
        time: priority.time || '',
        hasDetails: priority.hasDetails || false
      });
    }
  }, [priority]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    const priorityData = {
      ...formData,
      id: priority ? priority.id : Date.now(),
      completed: priority ? priority.completed : false
    };

    onSave(priorityData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white border-2 border-blue-200 rounded-lg p-4 mb-4 shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority Task
          </label>
          <input
            type="text"
            value={formData.text}
            onChange={(e) => handleChange('text', e.target.value)}
            placeholder="What needs to be done today?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Preference
            </label>
            <select
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Time</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.hasDetails}
              onChange={(e) => handleChange('hasDetails', e.target.checked)}
              className="mr-2 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Has additional details</span>
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {priority ? 'Update' : 'Add'} Priority
          </button>
        </div>
      </form>
    </div>
  );
};

export default PriorityForm;