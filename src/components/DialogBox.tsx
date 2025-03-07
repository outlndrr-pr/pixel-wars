import React from 'react';
import RetroWindow from './RetroWindow';
import RetroButton from './RetroButton';

type DialogBoxProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  isOpen: boolean;
  className?: string;
};

const DialogBox: React.FC<DialogBoxProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Yes',
  cancelText = 'No',
  isOpen,
  className = '',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <RetroWindow title={title} className={`w-80 ${className}`} onClose={onCancel}>
        <div className="text-center mb-4">{message}</div>
        <div className="flex justify-center gap-4">
          <RetroButton onClick={onConfirm}>{confirmText}</RetroButton>
          {onCancel && <RetroButton onClick={onCancel}>{cancelText}</RetroButton>}
        </div>
      </RetroWindow>
    </div>
  );
};

export default DialogBox; 