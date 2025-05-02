'use client';

import React, { useState, useEffect } from 'react';

const FoodModule = ({ onClose }) => {
  // Sample initial data
  const initialFoodList = [
    { id: 1, name: 'Spaghetti Carbonara', category: 'Dinner', notes: 'Family favorite' },
    { id: 2, name: 'Blueberry Muffins', category: 'Breakfast', notes: 'For weekend brunch' },
    { id: 3, name: 'Greek Salad', category: 'Lunch', notes: 'Light and healthy' },
  ];

  // State for managing food items
  const [foods, setFoods] = useState([]);
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [newFood, setNewFood] = useState({ name: '', category: 'Dinner', notes: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categories
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

  // Load data from Firebase
  useEffect(() => {
    // Import is inside useEffect to avoid SSR issues
    const fetchData = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { getFoods } = await import('../../lib/services/foodService');
        const foodsData = await getFoods();
        
        // If no data exists yet, use sample data
        if (foodsData.length === 0) {
          // Import is inside to avoid SSR issues
          const { addFood } = await import('../../lib/services/foodService');
          
          // Add sample data if collection is empty
          const addedFoods = await Promise.all(
            initialFoodList.map(food => addFood(food))
          );
          
          setFoods(addedFoods);
        } else {
          setFoods(foodsData);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching foods:", err);
        setError("Failed to load meal ideas. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFood({ ...newFood, [name]: value });
  };

  // Add a new food item
  const handleAddFood = async (e) => {
    e.preventDefault();
    if (newFood.name.trim() === '') return;
    
    const foodToAdd = {
      name: newFood.name.trim(),
      category: newFood.category,
      notes: newFood.notes.trim()
    };
    
    try {
      // Dynamic import to avoid SSR issues
      const { addFood } = await import('../../lib/services/foodService');
      const addedFood = await addFood(foodToAdd);
      
      setFoods([...foods, addedFood]);
      setNewFood({ name: '', category: 'Dinner', notes: '' });
      setIsAddingFood(false);
    } catch (err) {
      console.error("Error adding meal idea:", err);
      alert("Failed to add meal idea. Please try again.");
    }
  };
  
  // Delete a food item
  const handleDeleteFood = async (id) => {
    if (!confirm("Are you sure you want to delete this meal idea?")) {
      return;
    }
    
    try {
      // Dynamic import to avoid SSR issues
      const { deleteFood } = await import('../../lib/services/foodService');
      await deleteFood(id);
      
      // Update local state
      setFoods(foods.filter(food => food.id !== id));
    } catch (err) {
      console.error("Error deleting meal idea:", err);
      alert("Failed to delete meal idea. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="text-3xl mr-2">🍽️</span>
            <h2 className="text-xl font-bold">Food</h2>
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
          {/* Food list */}
          <div className="mb-4">
            <h3 className="font-bold mb-2">Meal Ideas</h3>
            
            {isLoading ? (
              <div className="py-4 text-center">
                <p>Loading meal ideas...</p>
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
            ) : foods.length === 0 ? (
              <p className="text-gray-500">No meal ideas added yet.</p>
            ) : (
              <ul className="space-y-2">
                {foods.map(food => (
                  <li key={food.id} className="border-b border-gray-100 pb-2">
                    <div className="flex justify-between">
                      <div className="font-bold">{food.name}</div>
                      <button 
                        onClick={() => handleDeleteFood(food.id)}
                        className="text-red-500 text-xs"
                        aria-label="Delete meal idea"
                      >
                        ×
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>{food.category}</div>
                      {food.notes && <div>{food.notes}</div>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Add food form */}
          {isAddingFood ? (
            <form onSubmit={handleAddFood} className="border rounded p-3 bg-gray-50">
              <div className="mb-3">
                <label className="block text-sm mb-1">Meal Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newFood.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter meal name"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm mb-1">Category</label>
                <select
                  name="category"
                  value={newFood.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-3">
                <label className="block text-sm mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={newFood.notes}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Any special instructions or notes (Optional)"
                  rows="2"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingFood(false)}
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
              onClick={() => setIsAddingFood(true)}
              className="w-full py-2 text-center border-2 border-black rounded-full font-bold"
            >
              + Add Meal Idea
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodModule;