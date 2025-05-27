'use client';

import React, { useEffect, useRef, forwardRef } from 'react';
import { ModalProps } from '@/types';

const Modal = forwardRef<HTMLDivElement, ModalProps>(({
  children,
  isOpen,
  onClose,
  title,
  size = 'medium',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = '',
  'data-testid': dataTestId,
  ...props
}, ref) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-2xl',
    fullscreen: 'max-w-full h-full m-0 rounded-none'
  };

  // Focus management
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        onClose();
      }

      // Focus trap
      if (event.key === 'Tab') {
        const modal = modalRef.current;
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleOverlayClick}
      data-testid={dataTestId}
    >
      <div
        ref={ref || modalRef}
        className={`
          relative bg-white rounded-lg shadow-xl w-full
          ${sizeClasses[size]}
          ${className}
        `.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        {...props}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {title && (
              <h2 
                id="modal-title" 
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-md"
                aria-label="Close modal"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

export default Modal;