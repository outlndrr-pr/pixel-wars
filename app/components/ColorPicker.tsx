'use client';

import { usePixelWar } from '../contexts/PixelWarContext';

// Define available colors
const COLORS = [
  "#FF0000", "#00FF00", "#0000FF", "#FFFF00",
  "#FF00FF", "#00FFFF", "#FF8800", "#8800FF",
  "#FF0088", "#00FF88", "#0088FF", "#88FF00"
];

export function ColorPicker() {
  const { selectedColor, setSelectedColor, user, teams } = usePixelWar();
  const userTeam = user?.teamId ? teams.find(team => team.id === user.teamId) : null;
  
  return (
    <div className="space-y-4">
      {userTeam && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: userTeam.color }}
          />
          <span className="text-sm font-medium">Team Color</span>
        </div>
      )}
      
      <div className="grid grid-cols-4 gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            className={`w-full h-10 rounded-md transition-all border ${
              selectedColor === color ? 'ring-2 ring-offset-2 ring-white' : 'border-gray-700'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>
    </div>
  );
}