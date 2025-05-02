'use client';

import React, { useState, useEffect } from 'react';
import Tooltip from './Tooltip';

const TooltipTour = ({ isActive, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  
  // Define tooltip steps
  const tooltipSteps = [
    {
      targetId: 'weather-card',
      position: 'bottom',
      content: (
        <div>
          <h3 className="font-bold text-sm mb-1">Weather Information</h3>
          <p className="text-xs">
            Here you can see today's weather and temperature at a glance.
          </p>
        </div>
      ),
    },
    {
      targetId: 'priorities-section',
      position: 'bottom',
      content: (
        <div>
          <h3 className="font-bold text-sm mb-1">Today's Priorities</h3>
          <p className="text-xs">
            This section shows your most important tasks for today. Tap the circles to mark them as completed.
          </p>
        </div>
      ),
    },
    {
      targetId: 'routine-section',
      position: 'right',
      content: (
        <div>
          <h3 className="font-bold text-sm mb-1">Daily Routine</h3>
          <p className="text-xs">
            Your daily schedule appears here. The yellow line shows your progress throughout the day.
          </p>
        </div>
      ),
    },
    {
      targetId: 'quick-access',
      position: 'top',
      content: (
        <div>
          <h3 className="font-bold text-sm mb-1">Quick Access</h3>
          <p className="text-xs">
            These buttons provide one-tap access to books, TV, medicine, and more.
          </p>
        </div>
      ),
    },
    {
      targetId: 'notes-section',
      position: 'top',
      content: (
        <div>
          <h3 className="font-bold text-sm mb-1">Send Notes</h3>
          <p className="text-xs">
            Use this box to send messages to your family members.
          </p>
        </div>
      ),
    },
    {
      targetId: 'call-section',
      position: 'top',
      content: (
        <div>
          <h3 className="font-bold text-sm mb-1">Quick Calls</h3>
          <p className="text-xs">
            Tap these buttons to call your family with one touch.
          </p>
        </div>
      ),
    }
  ];
  
  useEffect(() => {
    // Short delay before showing first tooltip for smooth transition
    if (isActive) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isActive]);
  
  const handleNext = () => {
    if (currentStep < tooltipSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete the tour
      setIsVisible(false);
      onComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    setIsVisible(false);
    onSkip();
  };
  
  const currentTooltip = tooltipSteps[currentStep - 1];
  
  if (!isActive || !isVisible) return null;
  
  return (
    <>
      {/* Semi-transparent overlay to highlight the tour */}
      <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={handleSkip}></div>
      
      <Tooltip
        targetId={currentTooltip.targetId}
        position={currentTooltip.position}
        content={currentTooltip.content}
        isVisible={isVisible}
        onClose={handleSkip}
        onNext={handleNext}
        onPrevious={handlePrevious}
        showNextButton={true}
        showPreviousButton={currentStep > 1}
        stepNumber={currentStep}
        totalSteps={tooltipSteps.length}
      />
    </>
  );
};

export default TooltipTour;