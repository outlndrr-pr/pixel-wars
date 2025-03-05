'use client';

import { usePixelWar } from '../contexts/PixelWarContext';
import { Card } from './ui';

// Define available colors
const COLORS = [
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFFFFF', // White
  '#000000', // Black
  '#FFA500', // Orange
  '#800080', // Purple
  '#008000', // Dark Green
  '#FFC0CB', // Pink
  '#A52A2A', // Brown
  '#808080', // Gray
  '#FFD700', // Gold
  '#C0C0C0', // Silver
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
      <div className="color-picker">
        {COLORS.map((color: string) => (
          <button
            key={color}
            className={`color-button ${selectedColor === color ? 'color-button-selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </Card>
  );
}