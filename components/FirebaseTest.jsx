'use client';

import React, { useState, useEffect } from 'react';
import { getItems, addItem, updateItem, deleteItem } from '../lib/db';

const FirebaseTest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [message, setMessage] = useState('');

  // Collection name to use for testing
  const COLLECTION = 'testItems';

  // Load data on component mount
  useEffect(() => {
    loadItems();
  }, []);

  // Function to load items from Firebase
  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getItems(COLLECTION);
      setItems(data);
      setMessage(`Successfully loaded ${data.length} items`);
    } catch (err) {
      console.error('Error loading items:', err);
      setError(`Error loading items: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add a new item
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setMessage('Attempting to add item to Firestore...');
      
      const newItem = {
        text: newItemText,
        completed: false,
        timestamp: new Date().toISOString()
      };
      
      console.log('Attempting to add item:', newItem);
      const addedItem = await addItem(COLLECTION, newItem);
      console.log('Response from addItem:', addedItem);
      
      setItems([...items, addedItem]);
      setNewItemText('');
      setMessage('Item added successfully!');
    } catch (err) {
      console.error('Error adding item:', err);
      // More detailed error message
      const errorDetails = err.code ? 
        `Error code: ${err.code}. ${err.message}` : 
        err.message;
      
      setError(`Error adding item: ${errorDetails}`);
    } finally {
      setLoading(false);
    }
  };

  // Toggle item completion status
  const toggleItemStatus = async (id, currentStatus) => {
    try {
      setLoading(true);
      setError(null);
      
      await updateItem(COLLECTION, id, { completed: !currentStatus });
      
      // Update local state
      setItems(items.map(item => 
        item.id === id ? { ...item, completed: !currentStatus } : item
      ));
      
      setMessage('Item updated successfully!');
    } catch (err) {
      console.error('Error updating item:', err);
      setError(`Error updating item: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete an item
  const handleDeleteItem = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await deleteItem(COLLECTION, id);
      
      // Update local state
      setItems(items.filter(item => item.id !== id));
      
      setMessage('Item deleted successfully!');
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(`Error deleting item: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-gray-50 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Firebase Firestore Test</h2>
      
      {/* Status message */}
      {message && (
        <div className="bg-green-100 border border-green-300 text-green-800 p-3 rounded mb-4">
          {message}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Add item form */}
      <form onSubmit={handleAddItem} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add new item..."
            className="flex-1 p-2 border border-gray-300 rounded-l"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
            disabled={loading || !newItemText.trim()}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>
      
      {/* Item list */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Items from Firestore:</h3>
        {loading && items.length === 0 ? (
          <p className="text-gray-500">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">No items found. Add one above!</p>
        ) : (
          <ul className="border border-gray-200 rounded divide-y">
            {items.map(item => (
              <li key={item.id} className="p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleItemStatus(item.id, item.completed)}
                    className="mr-3"
                    disabled={loading}
                  />
                  <span className={item.completed ? 'line-through text-gray-500' : ''}>
                    {item.text}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                  disabled={loading}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Refresh button */}
      <button
        onClick={loadItems}
        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {loading ? 'Refreshing...' : 'Refresh Items'}
      </button>
    </div>
  );
};

export default FirebaseTest;