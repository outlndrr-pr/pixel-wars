import React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  error,
  className = '',
  disabled,
  ...props
}) => {
  const checkboxClasses = `checkbox ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;
  const labelClasses = `${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`;
  
  return (
    <div className="checkbox-container">
      <label className={labelClasses}>
        <div className="flex items-start">
          <input
            type="checkbox"
            className={checkboxClasses}
            disabled={disabled}
            {...props}
          />
          
          {(label || description) && (
            <div className="ml-2">
              {label && <div className="text-sm font-medium">{label}</div>}
              {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
            </div>
          )}
        </div>
        
        {error && (
          <div className="mt-1 text-xs text-red-600">{error}</div>
        )}
      </label>
    </div>
  );
}; 