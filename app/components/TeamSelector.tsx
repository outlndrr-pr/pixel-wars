'use client';

import { usePixelWar } from '../contexts/PixelWarContext';
import { TeamId } from '../types';
import { Card, Badge } from './ui';

export function TeamSelector() {
  const { teams, user, joinTeam, getTeamPixelCount } = usePixelWar();
  
  return (
    <Card title="Choose Team" className="animate-fade-in">
      <div className="flex flex-col space-y-4">
        {/* Team selection with radio buttons */}
        <div className="grid grid-cols-2 gap-3 mb-2">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => joinTeam(team.id)}
              className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                user?.teamId === team.id 
                  ? 'bg-[var(--color-accent-bg)] border-2 border-[var(--color-accent)]' 
                  : 'bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
              }`}
            >
              <div 
                className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center border-2 ${
                  user?.teamId === team.id 
                    ? `border-[${team.color}]` 
                    : 'border-[var(--color-border-strong)]'
                }`}
              >
                {user?.teamId === team.id && (
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: team.color }}
                  />
                )}
              </div>
              <span 
                className="text-sm font-medium"
                style={{ color: user?.teamId === team.id ? team.color : 'var(--color-text-primary)' }}
              >
                {team.name}
              </span>
            </button>
          ))}
        </div>
        
        {user?.teamId ? (
          <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: teams.find(t => t.id === user.teamId)?.color }}
              />
              <p className="text-sm">
                You're on{' '}
                <span className="font-bold" style={{ color: teams.find(t => t.id === user.teamId)?.color }}>
                  {teams.find(t => t.id === user.teamId)?.name}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-[var(--color-accent-bg)] border border-[var(--color-accent)] border-opacity-20">
            <p className="text-sm font-medium text-[var(--color-accent)] text-center">
              Select a team to start placing pixels!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
} 