'use client';

import React, { useState, useEffect } from 'react';
import { fetchBooks, createBook, removeBook } from './BooksAdapter';

const BooksModule = ({ onClose }) => {
  console.log("BooksModule initializing...");
  
  // Sample initial data
  const initialBooksList = [
    { id: 1, title: 'The Lincoln Highway', author: 'Amor Towles', status: 'Reading' },
    { id: 2, title: 'Killers of the Flower Moon', author: 'David Grann', status: 'Completed' },
    { id: 3, title: 'Lessons in Chemistry', author: 'Bonnie Garmus', status: 'Want to Read' },
  ];

  // State for managing books
  const [books, setBooks] = useState([]);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', status: 'Want to Read' });

  // State for loading and error handling
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data from Firebase using direct adapter
  useEffect(() => {
    const fetchData = async () => {
      // Set a timeout to prevent indefinite loading - increased to 15 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("Fetching books timed out after 15 seconds"));
        }, 15000);
      });
      
      try {
        console.log("Starting to fetch books data using direct adapter");
        
        // Race between the fetch and the timeout
        const booksData = await Promise.race([
          fetchBooks(),
          timeoutPromise
        ]);
        
        console.log("Received books data from direct adapter:", booksData);
        
        // If no data exists yet, use sample data
        if (!booksData || booksData.length === 0) {
          console.log("No books found, adding sample data with direct adapter");
          
          try {
            // Add sample data if collection is empty
            const addPromises = initialBooksList.map(book => createBook(book));
            const addedBooks = await Promise.all(addPromises);
            
            console.log("Sample books added with direct adapter:", addedBooks);
            setBooks(addedBooks);
          } catch (addError) {
            console.error("Error adding sample books with direct adapter:", addError);
            // Fallback to just using the sample data directly without persisting
            setBooks(initialBooksList);
          }
        } else {
          console.log("Setting books from database");
          setBooks(booksData);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching books with direct adapter:", err);
        console.log("Using fallback data due to error");
        
        // On error, fallback to sample data
        setBooks(initialBooksList);
        setError(`${err.message}. Using local data instead.`);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  // Add a new book using direct adapter
  const handleAddBook = async (e) => {
    e.preventDefault();
    if (newBook.title.trim() === '') return;
    
    const bookToAdd = {
      title: newBook.title.trim(),
      author: newBook.author.trim(),
      status: newBook.status
    };
    
    try {
      console.log("Adding book with direct adapter:", bookToAdd);
      
      // Use direct adapter instead of dynamic import
      const addedBook = await createBook(bookToAdd);
      console.log("Book added with direct adapter:", addedBook);
      
      setBooks([...books, addedBook]);
      setNewBook({ title: '', author: '', status: 'Want to Read' });
      setIsAddingBook(false);
    } catch (err) {
      console.error("Error adding book with direct adapter:", err);
      alert("Failed to add book. Please try again.");
    }
  };
  
  // Delete a book using direct adapter
  const handleDeleteBook = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) {
      return;
    }
    
    try {
      console.log(`Attempting to delete book with ID: ${id} using direct adapter`);
      
      // Use direct adapter instead of dynamic import
      const result = await removeBook(id);
      console.log("Delete operation result from direct adapter:", result);
      
      // Update local state
      setBooks(books.filter(book => book.id !== id));
      console.log("Books state updated successfully after delete");
    } catch (err) {
      console.error("Error deleting book with direct adapter:", err);
      console.error("Error details:", JSON.stringify(err, null, 2));
      alert(`Failed to delete book. Error: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="text-3xl mr-2">📚</span>
            <h2 className="text-xl font-bold">Books</h2>
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
                <p className="text-sm text-gray-600 mb-3">Using local data while we fix this issue.</p>
                <div className="flex gap-2 justify-center">
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-3 py-1 bg-black text-white rounded"
                  >
                    Retry Connection
                  </button>
                </div>
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
                        className="bg-red-50 text-red-500 hover:bg-red-100 px-2 py-1 rounded-md text-sm font-bold"
                        aria-label="Delete book"
                      >
                        Delete
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

export default BooksModule;