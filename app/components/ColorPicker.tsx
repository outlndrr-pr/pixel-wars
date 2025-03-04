'use client';

import { usePixelWar } from '../contexts/PixelWarContext';

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
    <div className="card p-6">
      <h3 className="text-lg font-bold mb-4">Color Palette</h3>
      
      {/* Team color indicator */}
      {userTeamColor && (
        <div className="mb-4 p-3 rounded-md bg-[var(--secondary)] border border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-full border border-[var(--border)] shadow-sm" 
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
            className={`w-10 h-10 rounded-lg transition-all duration-200 shadow-sm ${
              selectedColor === color 
                ? 'ring-2 ring-[var(--primary)] ring-offset-2 scale-110' 
                : 'hover:scale-105 border border-[var(--border)]'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
            aria-label={`Select ${color} color`}
          />
        ))}
      </div>
      
      {/* Selected color indicator */}
      <div className="mt-4 flex items-center gap-3 p-3 rounded-md bg-[var(--secondary)]">
        <div 
          className="w-8 h-8 rounded-md shadow-sm" 
          style={{ backgroundColor: selectedColor }}
        />
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400">Selected</span>
          <span className="text-sm font-mono">{selectedColor}</span>
        </div>
      </div>
    </div>
  );
} 