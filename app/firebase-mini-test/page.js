'use client';

import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  limit, 
  doc, 
  setDoc,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';

export default function FirebaseMiniTest() {
  const [status, setStatus] = useState('Ready');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Test 1: Basic connection test
  const testConnection = async () => {
    setStatus('Testing connection...');
    setResult(null);
    setError(null);
    
    try {
      const q = query(collection(db, 'test'), limit(1));
      const snapshot = await getDocs(q);
      
      setResult({
        message: 'Connection successful!',
        docsCount: snapshot.size
      });
      setStatus('Connected');
    } catch (err) {
      console.error('Connection test failed:', err);
      setError(err.message || 'Unknown error');
      setStatus('Failed');
    }
  };
  
  // Test 2: Add a document directly with setDoc (more reliable than addDoc)
  const addDocument = async () => {
    setStatus('Adding document...');
    setResult(null);
    setError(null);
    
    try {
      // Generate a unique ID
      const uniqueId = `test-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const testDoc = doc(db, 'test', uniqueId);
      
      // Use setDoc instead of addDoc
      await setDoc(testDoc, {
        message: 'Test document',
        timestamp: new Date().toISOString(),
        id: uniqueId
      });
      
      setResult({
        message: 'Document added successfully!',
        docId: uniqueId
      });
      setStatus('Document added');
    } catch (err) {
      console.error('Add document failed:', err);
      setError(err.message || 'Unknown error');
      setStatus('Failed');
    }
  };
  
  // Test 3: Toggle network
  const toggleNetwork = async (enable) => {
    setStatus(enable ? 'Enabling network...' : 'Disabling network...');
    setResult(null);
    setError(null);
    
    try {
      if (enable) {
        await enableNetwork(db);
        setStatus('Network enabled');
      } else {
        await disableNetwork(db);
        setStatus('Network disabled');
      }
      
      setResult({
        message: enable ? 'Network enabled' : 'Network disabled'
      });
    } catch (err) {
      console.error('Network toggle failed:', err);
      setError(err.message || 'Unknown error');
      setStatus('Failed');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Firebase Mini Test</h1>
      <p className="mb-4">Status: <span className="font-medium">{status}</span></p>
      
      <div className="flex space-x-2 mb-6">
        <button
          onClick={testConnection}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
        >
          Test Connection
        </button>
        
        <button
          onClick={addDocument}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm"
        >
          Add Document
        </button>
        
        <button
          onClick={() => toggleNetwork(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded text-sm"
        >
          Enable Network
        </button>
        
        <button
          onClick={() => toggleNetwork(false)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm"
        >
          Disable Network
        </button>
      </div>
      
      {result && (
        <div className="bg-green-50 border border-green-200 p-4 rounded mb-4">
          <h3 className="font-bold text-green-800 mb-2">Result:</h3>
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded mb-4">
          <h3 className="font-bold text-red-800 mb-2">Error:</h3>
          <pre className="whitespace-pre-wrap text-sm text-red-600">
            {error}
          </pre>
          
          <div className="mt-3 pt-3 border-t border-red-200">
            <h4 className="font-medium mb-1">Possible solutions:</h4>
            <ul className="list-disc pl-5 text-sm">
              <li>Check if Firebase project exists and is properly configured</li>
              <li>Verify that Firestore database is created in your project</li>
              <li>Ensure your network connection is active</li>
              <li>Try disabling and re-enabling the network connection</li>
              <li>Check browser console for additional error details</li>
            </ul>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Using Firebase v{require('firebase/package.json').version}</p>
        <p>Project ID: {db ? db._databaseId?.projectId : 'Not initialized'}</p>
      </div>
    </div>
  );
}