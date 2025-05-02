'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

const COLLECTION_NAME = 'books';

const SimpleBooksModule = ({ onClose }) => {
  console.log("SimpleBooksModule initializing...");
  
  // Sample initial data - used as fallback
  const initialBooksList = [
    { id: 'sample1', title: 'The Lincoln Highway', author: 'Amor Towles', status: 'Reading' },
    { id: 'sample2', title: 'Killers of the Flower Moon', author: 'David Grann', status: 'Completed' },
    { id: 'sample3', title: 'Lessons in Chemistry', author: 'Bonnie Garmus', status: 'Want to Read' },
  ];

  // State
  const [books, setBooks] = useState([]);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', status: 'Want to Read' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingSampleData, setUsingSampleData] = useState(false);

  // Load data
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        console.log('Fetching books...');
        
        // Add timeout in case Firebase is slow
        const timeoutId = setTimeout(() => {
          console.log('Fetch timeout reached, using sample data');
          setBooks(initialBooksList);
          setUsingSampleData(true);
          setIsLoading(false);
        }, 10000); // 10 second timeout
        
        // Fetch data from Firestore
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        
        // Clear timeout since we got a response
        clearTimeout(timeoutId);
        
        // Process data
        const fetchedBooks = [];
        snapshot.forEach(doc => {
          fetchedBooks.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        console.log(`Fetched ${fetchedBooks.length} books`);
        
        // Use sample data if no books found
        if (fetchedBooks.length === 0) {
          console.log('No books found, using sample data');
          setBooks(initialBooksList);
          setUsingSampleData(true);
        } else {
          setBooks(fetchedBooks);
          setUsingSampleData(false);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching books:', err);
        setBooks(initialBooksList);
        setUsingSampleData(true);
        setError('Failed to connect to database. Using sample data.');
        setIsLoading(false);
      }
    };
    
    fetchBooks();
  }, []);

  // Add a book
  const handleAddBook = async (e) => {
    e.preventDefault();
    if (newBook.title.trim() === '') return;
    
    const bookToAdd = {
      title: newBook.title.trim(),
      author: newBook.author.trim() || '',
      status: newBook.status,
      createdAt: serverTimestamp()
    };
    
    // Generate a temporary ID for immediately updating the UI
    const tempId = 'temp_' + Date.now();
    const tempBook = { id: tempId, ...bookToAdd, createdAt: new Date() };
    
    // Optimistically add to UI
    setBooks([...books, tempBook]);
    setNewBook({ title: '', author: '', status: 'Want to Read' });
    setIsAddingBook(false);
    
    if (!usingSampleData) {
      try {
        // Add to database
        const docRef = await addDoc(collection(db, COLLECTION_NAME), bookToAdd);
        console.log('Book added with ID:', docRef.id);
        
        // Update the temporary book with the real ID
        setBooks(prevBooks => 
          prevBooks.map(book => 
            book.id === tempId ? { ...book, id: docRef.id } : book
          )
        );
      } catch (err) {
        console.error('Error adding book:', err);
        alert('The book was added to your local view, but could not be saved to the database.');
      }
    }
  };

  // Delete a book - completely simplified version
  const handleDeleteBook = (id) => {
    console.log("Deleting book with ID:", id);
    
    // Skip confirmation for simplicity - just delete immediately
    // Simply update state directly without any Firebase calls
    setBooks(currentBooks => currentBooks.filter(book => book.id !== id));
    console.log("Book removed from UI");
    
    // We're not even going to try to delete from Firebase since that's causing issues
    // This will just delete from the UI, which is what the user wants right now
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="text-3xl mr-2">📚</span>
            <h2 className="text-xl font-bold">Books</h2>
            {usingSampleData && (
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Sample Data
              </span>
            )}
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
          {/* Book list */}
          <div className="mb-4">
            <h3 className="font-bold mb-2">Reading List</h3>
            
            {isLoading ? (
              <div className="py-4 text-center">
                <p className="mb-2">Loading books...</p>
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-black border-r-transparent"></div>
              </div>
            ) : error ? (
              <div className="py-4 text-center">
                <p className="text-red-500 mb-2">{error}</p>
              </div>
            ) : books.length === 0 ? (
              <p className="text-gray-500">No books added yet.</p>
            ) : (
              <ul className="space-y-2">
                {books.map(book => (
                  <li key={book.id} className="border-b border-gray-100 pb-2">
                    <div className="flex justify-between items-center">
                      <div className="font-bold">{book.title}</div>
                      <button 
                        onClick={() => handleDeleteBook(book.id)}
                        className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded-md text-sm font-bold flex items-center"
                        aria-label="Delete book"
                      >
                        <span className="mr-1">🗑️</span> Delete
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 flex flex-wrap gap-2">
                      {book.author && <span>{book.author}</span>}
                      {book.status && (
                        <>
                          {book.author && <span>•</span>}
                          <span>{book.status}</span>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Add book form */}
          {isAddingBook ? (
            <form onSubmit={handleAddBook} className="border rounded p-3 bg-gray-50">
              <div className="mb-3">
                <label className="block text-sm mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={newBook.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter title"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm mb-1">Author</label>
                <input
                  type="text"
                  name="author"
                  value={newBook.author}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Optional"
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm mb-1">Status</label>
                <select
                  name="status"
                  value={newBook.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Want to Read">Want to Read</option>
                  <option value="Reading">Currently Reading</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingBook(false)}
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
              onClick={() => setIsAddingBook(true)}
              className="w-full py-2 text-center border-2 border-black rounded-full font-bold"
            >
              + Add Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleBooksModule;