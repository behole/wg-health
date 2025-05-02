'use client';

import { useState, useEffect } from 'react';
import { fetchAPI } from '../lib/api';

/**
 * Custom hook for fetching daily quotes
 * @returns {Object} Quote data and loading state
 */
const useQuote = () => {
  const [quote, setQuote] = useState({
    text: "Nothing is impossible, the word itself says 'I'm possible'!",
    author: "Audrey Hepburn"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        
        // Check if we have a quote in localStorage and it's from today
        const today = new Date().toISOString().split('T')[0];
        const storedQuote = localStorage.getItem('dailyQuote');
        const storedDate = localStorage.getItem('quoteDate');
        
        // If we have a stored quote from today, use it
        if (storedQuote && storedDate === today) {
          setQuote(JSON.parse(storedQuote));
          setLoading(false);
          return;
        }
        
        // Otherwise fetch a new quote
        const response = await fetchAPI('/api/quotes');
        if (response.daily) {
          setQuote(response.daily);
          
          // Store in localStorage with today's date
          localStorage.setItem('dailyQuote', JSON.stringify(response.daily));
          localStorage.setItem('quoteDate', today);
        }
      } catch (err) {
        console.error('Error fetching quote:', err);
        setError(err.message);
        
        // Use default quote on error
        if (!quote) {
          setQuote({
            text: "Nothing is impossible, the word itself says 'I'm possible'!",
            author: "Audrey Hepburn"
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  return { quote, loading, error };
};

export default useQuote;