'use client';

import { usePixelWar } from '../contexts/PixelWarContext';

export function TeamSelector() {
  const { teams, user, joinTeam, getTeamPixelCount } = usePixelWar();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {teams.map((team) => (
          <button
            key={team.id}
            className={`h-auto py-4 flex flex-col items-center gap-2 rounded-md transition-all ${
              user?.teamId === team.id 
                ? 'bg-slate-700 ring-2 ring-white ring-offset-2 ring-offset-slate-900' 
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
            onClick={() => joinTeam(team.id)}
          >
            <div 
              className="w-6 h-6 rounded-full" 
              style={{ backgroundColor: team.color }}
            />
            <span className="font-medium">{team.name}</span>
            <span className="text-xs text-slate-400">
              {getTeamPixelCount(team.id)} pixels
            </span>
          </button>
        ))}
      </div>
    </div>
  );
} 