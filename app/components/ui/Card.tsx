import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  headerActions,
  footer,
  noPadding = false,
}) => {
  const cardClasses = `card ${className}`;
  const bodyClasses = noPadding ? '' : 'p-6';
  
  return (
    <div className={cardClasses}>
      {(title || headerActions) && (
        <div className="flex justify-between items-center mb-4">
          <div>
            {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}
      
      <div className={bodyClasses}>
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-gray-100 mt-6 pt-4">
          {footer}
        </div>
      )}
    </div>
  );
}; 