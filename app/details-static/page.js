'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

// Sample data for static rendering
const sampleDetail = {
  type: 'priority',
  title: 'Rayf Wrestling Meet',
  time: 'Evening - 6:00 PM',
  location: 'Central High School Gym',
  notes: 'Bring a water bottle and snacks. Parking is in the west lot.',
  withPerson: 'Mike will drive you there'
};

// Static page that doesn't use dynamic parameters
export default function DetailsStaticPage() {
  const router = useRouter();
  
  const handleBack = () => {
    router.push('/');
  };
  
  return (
    <main className="flex flex-col min-h-screen bg-white text-black max-w-md mx-auto p-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={handleBack}
          className="mr-2 text-2xl"
          aria-label="Go back"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold">Sample Item Details</h1>
      </div>
      
      <p className="mb-4">This is a static details page example that works with static exports.</p>
      
      {/* Details Card */}
      <div className="bg-white border-2 border-black rounded-lg p-5 mb-6">
        <h2 className="font-bold text-xl mb-3">{sampleDetail.title}</h2>
        
        {/* Time */}
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-1">Time:</h3>
          <p className="text-xl">{sampleDetail.time}</p>
        </div>
        
        {/* Location */}
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-1">Where:</h3>
          <p className="text-xl">{sampleDetail.location}</p>
        </div>
        
        {/* Notes */}
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-1">Notes:</h3>
          <p className="text-xl bg-yellow-50 p-3 rounded-lg">{sampleDetail.notes}</p>
        </div>
      </div>
      
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="w-full bg-black text-white font-bold py-3 rounded-lg"
      >
        Back to Home
      </button>
    </main>
  );
}
