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
  const cardClasses = `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm ${className}`;
  const bodyClasses = noPadding ? '' : 'p-6';
  
  return (
    <div className={cardClasses}>
      {(title || headerActions) && (
        <div className="flex justify-between items-center p-6 pb-0">
          <div>
            {title && <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
          </div>
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}
      
      <div className={bodyClasses}>
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-gray-100 dark:border-gray-700 mt-6 pt-4 px-6 pb-6">
          {footer}
        </div>
      )}
    </div>
  );
}; 