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
      <div className="grid grid-cols-4 gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            className={`w-full aspect-square rounded-md transition-all duration-200 ${
              selectedColor === color 
                ? 'ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-card)] scale-110 shadow-md z-10' 
                : 'hover:scale-105 shadow-sm'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
      
      {/* Selected color indicator */}
      {selectedColor && (
        <div className="mt-4 p-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[var(--color-border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-md shadow-inner border border-[var(--color-border-strong)]" 
              style={{ backgroundColor: selectedColor }}
            />
            <span className="text-sm text-[var(--color-text-secondary)]">Selected</span>
          </div>
          <span className="text-xs font-mono bg-[rgba(0,0,0,0.2)] px-2 py-1 rounded">{selectedColor}</span>
        </div>
      )}
    </Card>
  );
} 