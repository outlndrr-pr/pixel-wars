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
  const userTeamColor = user.teamId 
    ? teams.find(team => team.id === user.teamId)?.color 
    : null;
  
  return (
    <div className="bg-white p-3 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Choose a color</h3>
      
      {/* Team color indicator */}
      {userTeamColor && (
        <div className="mb-3 p-2 border rounded-md">
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded-full border border-gray-300" 
              style={{ backgroundColor: userTeamColor }}
            />
            <span className="text-sm">Your team color</span>
          </div>
        </div>
      )}
      
      {/* Color grid */}
      <div className="grid grid-cols-4 gap-2">
        {COLORS.map(color => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedColor === color 
                ? 'border-black scale-110' 
                : 'border-gray-300 hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
            aria-label={`Select ${color} color`}
          />
        ))}
      </div>
      
      {/* Selected color indicator */}
      <div className="mt-3 flex items-center gap-2">
        <div 
          className="w-6 h-6 rounded-full border border-gray-300" 
          style={{ backgroundColor: selectedColor }}
        />
        <span className="text-sm">Selected: {selectedColor}</span>
      </div>
    </div>
  );
} 