import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string; // Custom color for the progress bar
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  variant = 'default',
  size = 'md',
  className = '',
  color,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const variantClasses = {
    default: 'bg-gray-600',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  const progressBarClasses = `progress-bar ${sizeClasses[size]} ${className}`;
  const fillClasses = color ? '' : `progress-bar-fill ${variantClasses[variant]}`;
  
  return (
    <div>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <div className="text-sm font-medium">{label}</div>}
          {showValue && <div className="text-sm text-gray-500">{value}/{max}</div>}
        </div>
      )}
      
      <div className={progressBarClasses}>
        <div
          className={fillClasses}
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color || undefined,
            height: '100%',
            borderRadius: 'inherit'
          }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}; 