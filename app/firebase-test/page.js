'use client';

import React from 'react';
import FirebaseTest from '../../components/FirebaseTest';

export default function FirebaseTestPage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Firebase Integration Test</h1>
      <p className="mb-4">
        This page tests the connection to Firebase Firestore. You can add, update, and delete items to verify that the database is working correctly.
      </p>
      <div className="mb-8">
        <FirebaseTest />
      </div>
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h2 className="font-bold mb-2">Firebase Setup Information</h2>
        <p className="mb-2">
          The Firebase configuration is stored in <code className="bg-gray-100 px-1 py-0.5 rounded">lib/firebase.js</code>
        </p>
        <p className="mb-2">
          The Firestore database operations are abstracted in <code className="bg-gray-100 px-1 py-0.5 rounded">lib/db.js</code>
        </p>
        <p>
          The security rules are defined in <code className="bg-gray-100 px-1 py-0.5 rounded">firestore.rules</code>, which currently allows all read/write operations for development.
        </p>
      </div>
    </main>
  );
}