'use client';

import React, { useState, useEffect, useRef } from 'react';

const Tooltip = ({ 
  targetId, 
  position = 'bottom', 
  content, 
  isVisible, 
  onClose, 
  onNext,
  onPrevious, 
  showNextButton = true, 
  showPreviousButton = false,
  stepNumber,
  totalSteps
}) => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);

  // Position the tooltip relative to the target element
  useEffect(() => {
    if (!isVisible) return;
    
    const positionTooltip = () => {
      const targetElement = document.getElementById(targetId);
      if (!targetElement || !tooltipRef.current) return;
      
      const targetRect = targetElement.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top, left;
      
      switch (position) {
        case 'top':
          top = targetRect.top - tooltipRect.height - 10;
          left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'bottom':
          top = targetRect.bottom + 10;
          left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'left':
          top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
          left = targetRect.left - tooltipRect.width - 10;
          break;
        case 'right':
          top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
          left = targetRect.right + 10;
          break;
        default:
          top = targetRect.bottom + 10;
          left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
      }
      
      // Ensure tooltip stays within viewport
      if (left < 10) left = 10;
      if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
      }
      
      if (top < 10) top = 10;
      if (top + tooltipRect.height > window.innerHeight - 10) {
        top = window.innerHeight - tooltipRect.height - 10;
      }
      
      setCoords({ top, left });
      
      // Add highlight effect to target element
      targetElement.classList.add('tooltip-target');
      
      return () => {
        targetElement.classList.remove('tooltip-target');
      };
    };
    
    positionTooltip();
    
    // Reposition on resize
    window.addEventListener('resize', positionTooltip);
    return () => {
      window.removeEventListener('resize', positionTooltip);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.classList.remove('tooltip-target');
      }
    };
  }, [isVisible, targetId, position]);
  
  if (!isVisible) return null;
  
  return (
    <div 
      ref={tooltipRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-60 max-w-xs"
      style={{ 
        top: `${coords.top}px`, 
        left: `${coords.left}px`,
        transition: 'all 0.3s ease'
      }}
    >
      <div className="text-gray-800">
        {content}
      </div>
      
      {/* Progress indicator if step information is provided */}
      {stepNumber && totalSteps && (
        <div className="flex justify-between items-center mt-3 mb-1">
          <div className="text-xs text-gray-500">
            Step {stepNumber} of {totalSteps}
          </div>
          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div 
                key={i} 
                className={`h-1 w-2 rounded-full ${
                  i + 1 <= stepNumber ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              ></div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between mt-2">
        <div>
          {showPreviousButton && (
            <button 
              onClick={onPrevious}
              className="text-purple-600 text-sm px-2 py-1 rounded hover:bg-purple-50"
            >
              Previous
            </button>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={onClose}
            className="text-gray-500 text-sm px-2 py-1 rounded hover:bg-gray-100"
          >
            Skip
          </button>
          
          {showNextButton && (
            <button 
              onClick={onNext}
              className="bg-purple-600 text-white text-sm px-3 py-1 rounded hover:bg-purple-700"
            >
              {stepNumber === totalSteps ? "Finish" : "Next"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;