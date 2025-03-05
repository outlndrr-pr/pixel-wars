'use client';

import { usePixelWar } from '../contexts/PixelWarContext';
import { TeamId } from '../types';
import { Card, Button, Badge, ProgressBar, RadioButton } from './ui';

export function TeamSelector() {
  const { teams, user, joinTeam, getTeamPixelCount } = usePixelWar();
  
  // Sort teams by pixel count (most pixels first)
  const sortedTeams = [...teams].sort((a, b) => {
    const countA = getTeamPixelCount(a.id);
    const countB = getTeamPixelCount(b.id);
    return countB - countA;
  });
  
  // Calculate pixel percentages for the progress bars
  const totalPixels = sortedTeams.reduce((sum, team) => sum + getTeamPixelCount(team.id), 0);
  
  return (
    <Card title="Choose Team" className="animate-fade-in">
      <div className="flex flex-col space-y-4">
        {/* Team selection with radio buttons */}
        <div className="flex justify-center space-x-8 mb-2">
          {teams.map((team) => (
            <div key={team.id} className="flex items-center">
              <RadioButton
                id={`team-${team.id}`}
                name="team-selection"
                checked={user?.teamId === team.id}
                onChange={() => joinTeam(team.id)}
                label={team.name}
                customStyles={{
                  labelColor: team.color,
                  radioColor: team.color
                }}
              />
            </div>
          ))}
        </div>
        
        {user?.teamId ? (
          <div className="p-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)]">
            <div className="flex items-center gap-3 mb-1">
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
          <div className="p-3 rounded-lg bg-[var(--color-accent-light)] border border-[var(--color-accent)] border-opacity-20">
            <p className="text-sm font-medium text-[var(--color-accent)] text-center">
              Select a team to start placing pixels!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
} 