'use client';

import React, { useState, useEffect } from 'react';

const TvModule = ({ onClose }) => {
  // State for managing shows
  const [shows, setShows] = useState([]);
  const [isAddingShow, setIsAddingShow] = useState(false);
  const [newShow, setNewShow] = useState({ title: '', year: '', platform: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data from Firebase
  useEffect(() => {
    // Import is inside useEffect to avoid SSR issues
    const fetchData = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { getTvShows } = await import('../../lib/services/tvService');
        const showsData = await getTvShows();
        
        // If no data exists yet, use sample data
        if (showsData.length === 0) {
          const sampleData = [
            { title: 'Succession', year: '2018', platform: 'HBO Max' },
            { title: 'Dune: Part Two', year: '2024', platform: 'Theaters' },
            { title: 'Oppenheimer', year: '2023', platform: 'Peacock' },
          ];
          
          // Import is inside to avoid SSR issues
          const { addTvShow } = await import('../../lib/services/tvService');
          
          // Add sample data if collection is empty
          const addedShows = await Promise.all(
            sampleData.map(show => addTvShow(show))
          );
          
          setShows(addedShows);
        } else {
          setShows(showsData);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching TV shows:", err);
        setError("Failed to load TV shows. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShow({ ...newShow, [name]: value });
  };

  // Add a new show
  const handleAddShow = async (e) => {
    e.preventDefault();
    if (newShow.title.trim() === '') return;
    
    const showToAdd = {
      title: newShow.title.trim(),
      year: newShow.year.trim(),
      platform: newShow.platform.trim()
    };
    
    try {
      // Dynamic import to avoid SSR issues
      const { addTvShow } = await import('../../lib/services/tvService');
      const addedShow = await addTvShow(showToAdd);
      
      setShows([...shows, addedShow]);
      setNewShow({ title: '', year: '', platform: '' });
      setIsAddingShow(false);
    } catch (err) {
      console.error("Error adding show:", err);
      alert("Failed to add show. Please try again.");
    }
  };
  
  // Delete a show
  const handleDeleteShow = async (id) => {
    if (!confirm("Are you sure you want to delete this show?")) {
      return;
    }
    
    try {
      // Dynamic import to avoid SSR issues
      const { deleteTvShow } = await import('../../lib/services/tvService');
      await deleteTvShow(id);
      
      // Update local state
      setShows(shows.filter(show => show.id !== id));
    } catch (err) {
      console.error("Error deleting show:", err);
      alert("Failed to delete show. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="text-3xl mr-2">📺</span>
            <h2 className="text-xl font-bold">TV & Movies</h2>
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
            
            {isLoading ? (
              <div className="py-4 text-center">
                <p>Loading shows...</p>
              </div>
            ) : error ? (
              <div className="py-4 text-center text-red-500">
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-2 px-3 py-1 bg-black text-white rounded"
                >
                  Retry
                </button>
              </div>
            ) : shows.length === 0 ? (
              <p className="text-gray-500">No shows or movies added yet.</p>
            ) : (
              <ul className="space-y-2">
                {shows.map(show => (
                  <li key={show.id} className="border-b border-gray-100 pb-2">
                    <div className="flex justify-between">
                      <div className="font-bold">{show.title}</div>
                      <button 
                        onClick={() => handleDeleteShow(show.id)}
                        className="text-red-500 text-xs"
                        aria-label="Delete show"
                      >
                        ×
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

export default TvModule;