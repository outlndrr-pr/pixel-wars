import React from 'react';

interface RadioButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
  customStyles?: {
    labelColor?: string;
    radioColor?: string;
  };
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  description,
  error,
  className = '',
  disabled,
  customStyles,
  ...props
}) => {
  const radioClasses = `radio ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;
  const labelClasses = `${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`;
  
  return (
    <div className="radio-container">
      <label className={labelClasses}>
        <div className="flex items-start">
          <div 
            className="relative w-5 h-5 rounded-full border-2 flex items-center justify-center"
            style={{ 
              borderColor: customStyles?.radioColor || 'currentColor',
            }}
          >
            {props.checked && (
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ 
                  backgroundColor: customStyles?.radioColor || 'currentColor' 
                }}
              />
            )}
            <input
              type="radio"
              className="sr-only"
              disabled={disabled}
              {...props}
            />
          </div>
          
          {(label || description) && (
            <div className="ml-2">
              {label && (
                <div 
                  className="text-sm font-medium"
                  style={{ color: customStyles?.labelColor }}
                >
                  {label}
                </div>
              )}
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