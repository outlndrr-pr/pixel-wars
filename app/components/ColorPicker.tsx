'use client';

import { usePixelWar } from '../contexts/PixelWarContext';
import { Card } from './ui';

// Array of colors for the color picker
const COLORS = [
  // Team colors
  '#FF5555', // Red team
  '#5555FF', // Blue team
  '#55AA55', // Green team
  '#FFFF55', // Yellow team
  
  // Additional colors
  '#FF9999', // Light red
  '#99BBFF', // Light blue
  '#99FF99', // Light green
  '#FFFFAA', // Light yellow
  
  '#FFFFFF', // White
  '#000000', // Black
  '#888888', // Gray
  '#FF55FF', // Pink
  '#55FFFF', // Cyan
  '#FFAA55', // Orange
  '#AA55FF', // Purple
  '#995522', // Brown
];

export function ColorPicker() {
  const { selectedColor, setSelectedColor, user, teams } = usePixelWar();
  
  // Get user's team color
  const userTeamColor = user?.teamId 
    ? teams.find(team => team.id === user?.teamId)?.color 
    : null;
  
  return (
    <Card title="Color Palette" className="animate-fade-in">
      {/* Team color indicator */}
      {userTeamColor && (
        <div className="mb-4 p-3 rounded-md bg-[var(--color-background)] border border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-full border border-[var(--color-border)] shadow-sm" 
              style={{ backgroundColor: userTeamColor }}
            />
            <span className="text-sm font-medium">Your team color</span>
          </div>
        </div>
      )}
      
      {/* Color grid */}
      <div className="grid grid-cols-4 gap-3">
        {COLORS.map(color => (
          <button
            key={color}
            className={`w-12 h-12 rounded-lg transition-all duration-200 shadow-sm ${
              selectedColor === color 
                ? 'ring-2 ring-[var(--color-accent)] ring-offset-2 scale-110' 
                : 'hover:scale-105 border border-[var(--color-border)]'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
            aria-label={`Select ${color} color`}
          />
        ))}
      </div>
      
      {/* Selected color indicator */}
      <div className="mt-4 flex items-center gap-3 p-3 rounded-md bg-[var(--color-background)]">
        <div 
          className="w-10 h-10 rounded-md shadow-sm" 
          style={{ backgroundColor: selectedColor }}
        />
        <div className="flex flex-col">
          <span className="text-xs text-[var(--color-text-secondary)]">Selected</span>
          <span className="text-sm font-mono font-medium">{selectedColor}</span>
        </div>
      </div>
    </Card>
  );
} 