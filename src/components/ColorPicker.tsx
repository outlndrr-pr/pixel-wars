import React from 'react';
import { DEFAULT_COLORS } from '@/context/CanvasContext';
import RetroWindow from './RetroWindow';

type ColorPickerProps = {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  className?: string;
};

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorSelect,
  className = '',
}) => {
  return (
    <RetroWindow title="Colors" className={className}>
      <div className="retro-color-picker">
        {DEFAULT_COLORS.map((color) => (
          <div
            key={color}
            className={`retro-color-option ${selectedColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onColorSelect(color)}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </RetroWindow>
  );
};

export default ColorPicker; 