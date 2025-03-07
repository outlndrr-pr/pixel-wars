import React, { ReactNode } from 'react';

type RetroWindowProps = {
  title: string;
  children: ReactNode;
  className?: string;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
};

const RetroWindow: React.FC<RetroWindowProps> = ({
  title,
  children,
  className = '',
  onClose,
  onMinimize,
  onMaximize,
}) => {
  return (
    <div className={`retro-window ${className}`}>
      <div className="retro-window-header">
        <div className="retro-window-title">{title}</div>
        <div className="retro-window-controls">
          {onMinimize && (
            <div
              className="retro-window-control minimize"
              onClick={onMinimize}
              aria-label="Minimize"
            />
          )}
          {onMaximize && (
            <div
              className="retro-window-control maximize"
              onClick={onMaximize}
              aria-label="Maximize"
            />
          )}
          {onClose && (
            <div
              className="retro-window-control close"
              onClick={onClose}
              aria-label="Close"
            />
          )}
        </div>
      </div>
      <div className="retro-window-content">{children}</div>
    </div>
  );
};

export default RetroWindow; 