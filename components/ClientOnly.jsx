'use client';

import { useEffect, useState } from 'react';

// Component that only renders its children on the client-side
// This is used to prevent hydration errors when content depends on browser-specific APIs
export default function ClientOnly({ children, fallback = null }) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Return fallback (or null) on the server and during initial client hydration
  if (!isClient) {
    return fallback;
  }
  
  // Once we're in the browser, render the children
  return children;
}