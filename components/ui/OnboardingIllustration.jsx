'use client';

import React from 'react';

// Simple SVG illustrations for onboarding
const OnboardingIllustration = ({ type, className = "w-32 h-32 mx-auto my-4" }) => {
  // Define different illustrations based on type
  switch (type) {
    case 'welcome':
      return (
        <div className={className}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#f3e8ff" />
            <path d="M50 20C33.4 20 20 33.4 20 50s13.4 30 30 30 30-13.4 30-30S66.6 20 50 20zm0 55c-13.8 0-25-11.2-25-25s11.2-25 25-25 25 11.2 25 25-11.2 25-25 25z" fill="#a855f7" />
            <circle cx="40" cy="40" r="5" fill="#a855f7" />
            <circle cx="60" cy="40" r="5" fill="#a855f7" />
            <path d="M65 55c-1.2 5.4-7.8 10-15 10s-13.8-4.6-15-10" fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      );
      
    case 'daily':
      return (
        <div className={className}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="60" height="60" rx="5" fill="#f3e8ff" />
            <rect x="25" y="30" width="50" height="10" rx="2" fill="#a855f7" />
            <rect x="25" y="45" width="50" height="5" rx="2" fill="#d8b4fe" />
            <rect x="25" y="55" width="50" height="5" rx="2" fill="#d8b4fe" />
            <rect x="25" y="65" width="50" height="5" rx="2" fill="#d8b4fe" />
            <circle cx="25" cy="45" r="3" fill="#a855f7" />
            <circle cx="25" cy="55" r="3" fill="#a855f7" />
            <circle cx="25" cy="65" r="3" fill="#a855f7" />
          </svg>
        </div>
      );
      
    case 'quickAccess':
      return (
        <div className={className}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="25" height="25" rx="5" fill="#f3e8ff" />
            <rect x="55" y="20" width="25" height="25" rx="5" fill="#f3e8ff" />
            <rect x="20" y="55" width="25" height="25" rx="5" fill="#f3e8ff" />
            <rect x="55" y="55" width="25" height="25" rx="5" fill="#f3e8ff" />
            <text x="32.5" y="36" fontSize="12" textAnchor="middle" fill="#a855f7">📚</text>
            <text x="67.5" y="36" fontSize="12" textAnchor="middle" fill="#a855f7">📺</text>
            <text x="32.5" y="71" fontSize="12" textAnchor="middle" fill="#a855f7">💊</text>
            <text x="67.5" y="71" fontSize="12" textAnchor="middle" fill="#a855f7">🍽️</text>
          </svg>
        </div>
      );
      
    case 'connect':
      return (
        <div className={className}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="35" r="15" fill="#f3e8ff" />
            <circle cx="65" cy="65" r="15" fill="#f3e8ff" />
            <path d="M35 50C35 50 40 60 50 60C60 60 65 50 65 50" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
            <text x="35" y="38" fontSize="12" textAnchor="middle" fill="#a855f7">👨</text>
            <text x="65" y="68" fontSize="12" textAnchor="middle" fill="#a855f7">👩</text>
          </svg>
        </div>
      );
      
    case 'preferences':
      return (
        <div className={className}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="30" width="50" height="40" rx="5" fill="#f3e8ff" />
            <rect x="30" y="40" width="40" height="5" rx="2" fill="#a855f7" />
            <rect x="30" y="50" width="40" height="5" rx="2" fill="#d8b4fe" />
            <rect x="30" y="60" width="40" height="5" rx="2" fill="#d8b4fe" />
            <circle cx="50" cy="20" r="10" fill="#a855f7" />
            <path d="M45 20 L48 23 L55 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
      
    default:
      return null;
  }
};

export default OnboardingIllustration;