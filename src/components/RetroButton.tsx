import React, { ButtonHTMLAttributes } from 'react';

type RetroButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};

const RetroButton: React.FC<RetroButtonProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <button className={`retro-button ${className}`} {...props}>
      {children}
    </button>
  );
};

export default RetroButton; 