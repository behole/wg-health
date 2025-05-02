'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-xl mb-8">Sorry, we couldn't find the page you're looking for.</p>
      <button
        onClick={() => router.push('/')}
        className="bg-black text-white py-3 px-6 rounded-lg text-lg font-medium"
      >
        Go Home
      </button>
    </div>
  );
}
