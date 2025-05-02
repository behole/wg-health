'use client';

import React, { useState } from 'react';

const SimpleTvModule = ({ onClose }) => {
  console.log("SimpleTvModule initializing...");
  
  // Sample initial data - used as the actual data for simplicity
  const initialTvShowsList = [
    { id: 'sample1', title: 'Succession', year: '2018', platform: 'HBO Max' },
    { id: 'sample2', title: 'Dune: Part Two', year: '2024', platform: 'Theaters' },
    { id: 'sample3', title: 'Oppenheimer', year: '2023', platform: 'Peacock' },
  ];

  // State
  const [shows, setShows] = useState(initialTvShowsList);
  const [isAddingShow, setIsAddingShow] = useState(false);
  const [newShow, setNewShow] = useState({ title: '', year: '', platform: '' });

  // Add a show
  const handleAddShow = (e) => {
    e.preventDefault();
    if (newShow.title.trim() === '') return;
    
    const showToAdd = {
      id: 'new_' + Date.now(),
      title: newShow.title.trim(),
      year: newShow.year.trim() || '',
      platform: newShow.platform.trim() || ''
    };
    
    // Update UI
    setShows([...shows, showToAdd]);
    setNewShow({ title: '', year: '', platform: '' });
    setIsAddingShow(false);
  };

  // Delete a show
  const handleDeleteShow = (id) => {
    console.log("Deleting show with ID:", id);
    setShows(shows.filter(show => show.id !== id));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShow({ ...newShow, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="text-3xl mr-2">📺</span>
            <h2 className="text-xl font-bold">TV & Movies</h2>
            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Local Data
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Show list */}
          <div className="mb-4">
            <h3 className="font-bold mb-2">Watch List</h3>
            
            {shows.length === 0 ? (
              <p className="text-gray-500">No shows or movies added yet.</p>
            ) : (
              <ul className="space-y-2">
                {shows.map(show => (
                  <li key={show.id} className="border-b border-gray-100 pb-2">
                    <div className="flex justify-between items-center">
                      <div className="font-bold">{show.title}</div>
                      <button 
                        onClick={() => handleDeleteShow(show.id)}
                        className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded-md text-sm font-bold flex items-center"
                        aria-label="Delete show"
                      >
                        <span className="mr-1">🗑️</span> Delete
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 flex flex-wrap gap-2">
                      {show.year && <span>{show.year}</span>}
                      {show.platform && (
                        <>
                          {show.year && <span>•</span>}
                          <span>{show.platform}</span>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Add show form */}
          {isAddingShow ? (
            <form onSubmit={handleAddShow} className="border rounded p-3 bg-gray-50">
              <div className="mb-3">
                <label className="block text-sm mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={newShow.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter title"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm mb-1">Year</label>
                <input
                  type="text"
                  name="year"
                  value={newShow.year}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Optional"
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm mb-1">Platform</label>
                <input
                  type="text"
                  name="platform"
                  value={newShow.platform}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Netflix, HBO, etc. (Optional)"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingShow(false)}
                  className="px-3 py-1 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-black text-white rounded"
                >
                  Add
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAddingShow(true)}
              className="w-full py-2 text-center border-2 border-black rounded-full font-bold"
            >
              + Add Show or Movie
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleTvModule;