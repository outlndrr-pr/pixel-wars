import React from 'react';

interface RadioButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  description,
  error,
  className = '',
  disabled,
  ...props
}) => {
  const radioClasses = `radio ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;
  const labelClasses = `${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`;
  
  return (
    <div className="radio-container">
      <label className={labelClasses}>
        <div className="flex items-start">
          <input
            type="radio"
            className={radioClasses}
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