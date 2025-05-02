'use client';

import { doc, deleteDoc, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Collection name
const COLLECTION_NAME = 'books';

// Fetch all books
export const fetchBooks = async () => {
  try {
    console.log('Directly fetching books from Firestore - start time:', new Date().toISOString());
    console.log('Firestore instance:', db ? 'Available' : 'Not available');
    
    // Get collection reference
    console.log('Getting collection reference');
    const booksCollection = collection(db, COLLECTION_NAME);
    console.log('Collection reference obtained');
    
    // Fetch documents with timing
    const fetchStart = performance.now();
    console.log('Starting getDocs operation');
    const querySnapshot = await getDocs(booksCollection);
    const fetchEnd = performance.now();
    console.log(`getDocs operation completed in ${fetchEnd - fetchStart}ms`);
    
    // Process results
    const books = [];
    console.log('Processing query results');
    querySnapshot.forEach((doc) => {
      books.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Fetched ${books.length} books directly, end time:`, new Date().toISOString());
    return books;
  } catch (error) {
    console.error('Error directly fetching books:', error);
    console.error('Error details:', error.code, error.message);
    throw error;
  }
};

// Add a new book
export const createBook = async (book) => {
  try {
    console.log('Directly adding book to Firestore');
    // Clean the book object
    const cleanBook = JSON.parse(JSON.stringify(book));
    
    // Add timestamps
    const bookWithTimestamp = {
      ...cleanBook,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Add document
    const docRef = await addDoc(collection(db, COLLECTION_NAME), bookWithTimestamp);
    console.log(`Book added with ID: ${docRef.id}`);
    
    return {
      id: docRef.id,
      ...cleanBook
    };
  } catch (error) {
    console.error('Error directly adding book:', error);
    throw error;
  }
};

// Remove a book
export const removeBook = async (bookId) => {
  try {
    console.log(`Directly deleting book with ID: ${bookId}`);
    
    // Get document reference
    const docRef = doc(db, COLLECTION_NAME, bookId);
    
    // Delete document
    await deleteDoc(docRef);
    console.log(`Book with ID ${bookId} deleted successfully`);
    
    return true;
  } catch (error) {
    console.error(`Error directly deleting book with ID ${bookId}:`, error);
    throw error;
  }
};