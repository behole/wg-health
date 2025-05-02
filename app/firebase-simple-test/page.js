'use client';

import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function SimpleFirebaseTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  
  const testConnection = async () => {
    setLoading(true);
    setResult('');
    setError('');
    
    try {
      const testCollection = collection(db, 'test');
      
      // Test writing to Firestore
      setResult('Adding document to Firestore...');
      const docRef = await addDoc(testCollection, {
        message: 'Test connection',
        timestamp: new Date().toISOString()
      });
      
      setResult((prev) => prev + `\nDocument added with ID: ${docRef.id}`);
      
      // Test reading from Firestore
      setResult((prev) => prev + '\nReading documents from Firestore...');
      const querySnapshot = await getDocs(testCollection);
      
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      
      setResult((prev) => prev + `\nFound ${docs.length} documents in the test collection.`);
      if (docs.length > 0) {
        setResult((prev) => prev + '\nLatest document: ' + JSON.stringify(docs[0], null, 2));
      }
    } catch (err) {
      console.error('Firebase test error:', err);
      setError(`Firebase error: ${err.message}\nCode: ${err.code || 'unknown'}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Simple Firebase Connection Test</h1>
      
      <button 
        onClick={testConnection}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? 'Testing...' : 'Test Firebase Connection'}
      </button>
      
      {result && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-4 whitespace-pre-line">
          <h2 className="font-bold text-green-800 mb-2">Result:</h2>
          {result}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-4">
          <h2 className="font-bold text-red-800 mb-2">Error:</h2>
          <pre className="whitespace-pre-line">{error}</pre>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="font-bold mb-1">Possible Solutions:</h3>
            <ul className="list-disc pl-5">
              <li>Make sure your Firebase project is properly set up</li>
              <li>Verify that your Firestore database has been created in the Firebase console</li>
              <li>Check that your Firestore rules allow read/write operations</li>
              <li>Ensure your API key is correct and has Firestore permissions</li>
              <li>Try using the Firebase emulator for local development</li>
            </ul>
          </div>
        </div>
      )}
      
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-md mt-8">
        <h2 className="font-bold mb-2">Firebase Resources:</h2>
        <ul className="list-disc pl-5">
          <li><a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Firebase Console</a></li>
          <li><a href="https://firebase.google.com/docs/web/setup" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Firebase Web Setup Guide</a></li>
          <li><a href="https://firebase.google.com/docs/firestore" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Firestore Documentation</a></li>
        </ul>
      </div>
    </div>
  );
}