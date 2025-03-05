'use client';

import { usePixelWar } from '../contexts/PixelWarContext';

export function TeamSelector() {
  const { teams, user, joinTeam } = usePixelWar();

  return (
    <div className="team-selector">
      {teams.map((team) => (
        <button
          key={team.id}
          onClick={() => joinTeam(team.id)}
          className={`btn ${
            user?.teamId === team.id ? 'btn-primary' : 'btn-secondary'
          } w-full flex items-center gap-3 justify-start`}
        >
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: team.color }}
          />
          <span>{team.name}</span>
        </button>
      ))}
    </div>
  );
} 