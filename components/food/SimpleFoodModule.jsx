'use client';

import React, { useState } from 'react';

const SimpleFoodModule = ({ onClose }) => {
  console.log("SimpleFoodModule initializing...");
  
  // Sample initial data - used as the actual data for simplicity
  const initialFoodList = [
    { id: 'sample1', name: 'Spaghetti Carbonara', category: 'Dinner', notes: 'Family favorite' },
    { id: 'sample2', name: 'Blueberry Muffins', category: 'Breakfast', notes: 'For weekend brunch' },
    { id: 'sample3', name: 'Greek Salad', category: 'Lunch', notes: 'Light and healthy' },
  ];

  // Categories
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

  // State
  const [foods, setFoods] = useState(initialFoodList);
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [newFood, setNewFood] = useState({ name: '', category: 'Dinner', notes: '' });

  // Add a food item
  const handleAddFood = (e) => {
    e.preventDefault();
    if (newFood.name.trim() === '') return;
    
    const foodToAdd = {
      id: 'new_' + Date.now(),
      name: newFood.name.trim(),
      category: newFood.category,
      notes: newFood.notes.trim() || ''
    };
    
    // Update UI
    setFoods([...foods, foodToAdd]);
    setNewFood({ name: '', category: 'Dinner', notes: '' });
    setIsAddingFood(false);
  };

  // Delete a food item
  const handleDeleteFood = (id) => {
    console.log("Deleting food with ID:", id);
    setFoods(foods.filter(food => food.id !== id));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFood({ ...newFood, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="text-3xl mr-2">🍽️</span>
            <h2 className="text-xl font-bold">Food</h2>
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
          {/* Food list */}
          <div className="mb-4">
            <h3 className="font-bold mb-2">Meal Ideas</h3>
            
            {foods.length === 0 ? (
              <p className="text-gray-500">No meal ideas added yet.</p>
            ) : (
              <ul className="space-y-2">
                {foods.map(food => (
                  <li key={food.id} className="border-b border-gray-100 pb-2">
                    <div className="flex justify-between items-center">
                      <div className="font-bold">{food.name}</div>
                      <button 
                        onClick={() => handleDeleteFood(food.id)}
                        className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded-md text-sm font-bold flex items-center"
                        aria-label="Delete food"
                      >
                        <span className="mr-1">🗑️</span> Delete
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

export default SimpleFoodModule;