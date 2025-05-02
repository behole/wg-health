import { NextResponse } from 'next/server';

// Collection of inspirational quotes
const quotes = [
  {
    text: "Nothing is impossible, the word itself says 'I'm possible'!",
    author: "Audrey Hepburn"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb"
  },
  {
    text: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs"
  },
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt"
  },
  {
    text: "Happiness is not something ready-made. It comes from your own actions.",
    author: "Dalai Lama"
  },
  {
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu"
  },
  {
    text: "Every moment is a fresh beginning.",
    author: "T.S. Eliot"
  },
  {
    text: "The purpose of our lives is to be happy.",
    author: "Dalai Lama"
  },
  {
    text: "Don't count the days, make the days count.",
    author: "Muhammad Ali"
  },
  {
    text: "Happiness is a warm puppy.",
    author: "Charles M. Schulz"
  }
];

export async function GET(request) {
  try {
    // Get a random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    // Get today's date in YYYY-MM-DD format to use as a seed
    const today = new Date().toISOString().split('T')[0];
    
    // Use today's date to deterministically select a quote
    // This ensures the same quote is returned for the entire day
    const dateHash = hashCode(today);
    const dailyQuote = quotes[Math.abs(dateHash) % quotes.length];
    
    return NextResponse.json({
      random: randomQuote,
      daily: dailyQuote,
      date: today
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch quote',
        daily: {
          text: "Nothing is impossible, the word itself says 'I'm possible'!",
          author: "Audrey Hepburn"
        }
      }, 
      { status: 500 }
    );
  }
}

// Simple string hash function
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}