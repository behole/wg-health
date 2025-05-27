import React, { forwardRef } from 'react';
import { CardProps } from '../../types';

const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  title,
  subtitle,
  actions,
  padding = 'medium',
  variant = 'default',
  className = '',
  'data-testid': dataTestId,
  ...props
}, ref) => {
  const baseClasses = 'bg-white rounded-lg transition-all duration-200';
  
  const variantClasses = {
    default: 'border border-gray-200',
    elevated: 'shadow-md hover:shadow-lg',
    outlined: 'border-2 border-gray-300'
  };

  const paddingClasses = {
    none: '',
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={classes}
      data-testid={dataTestId}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2 ml-4">
              {actions}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;