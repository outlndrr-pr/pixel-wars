'use client';

import { usePixelWar } from '../contexts/PixelWarContext';
import { TeamId } from '../types';
import { Card, Button, Badge, ProgressBar } from './ui';

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
    <Card title="Teams" className="animate-fade-in">
      {user?.teamId ? (
        <div className="mb-5 p-4 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)]">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-5 h-5 rounded-full" 
              style={{ backgroundColor: teams.find(t => t.id === user.teamId)?.color }}
            />
            <p className="font-medium">
              You're on{' '}
              <span className="font-bold" style={{ color: teams.find(t => t.id === user.teamId)?.color }}>
                {teams.find(t => t.id === user.teamId)?.name}
              </span>
            </p>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            You can switch teams, but it's better to stick with one for coordination.
          </p>
        </div>
      ) : (
        <div className="mb-5 p-4 rounded-lg bg-[var(--color-accent-light)] border border-[var(--color-accent)] border-opacity-20">
          <p className="text-sm font-medium text-[var(--color-accent)]">
            Join a team to start placing pixels on the canvas!
          </p>
        </div>
      )}
      
      <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">Territory Control</h3>
      
      <div className="space-y-4">
        {sortedTeams.map(team => {
          const pixelCount = getTeamPixelCount(team.id);
          const percentage = totalPixels === 0 ? 0 : Math.round((pixelCount / totalPixels) * 100);
          const isUserTeam = user?.teamId === team.id;
          
          return (
            <div 
              key={team.id} 
              className={`rounded-lg p-4 transition-all duration-200 ${
                isUserTeam 
                  ? 'border-2 border-[var(--color-accent)]' 
                  : 'border border-[var(--color-border)] hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: team.color }} 
                  />
                  <h4 className="font-medium">{team.name}</h4>
                  
                  {isUserTeam && (
                    <Badge variant="accent" className="ml-1">Your team</Badge>
                  )}
                </div>
                
                {!isUserTeam && (
                  <Button 
                    variant="accent" 
                    size="sm" 
                    onClick={() => joinTeam(team.id as TeamId)}
                  >
                    Join
                  </Button>
                )}
              </div>
              
              {/* Progress bar */}
              <ProgressBar 
                value={percentage} 
                max={100}
                size="sm"
                className="mt-2"
              />
              
              <div className="flex justify-between text-xs mt-2">
                <span className="text-[var(--color-text-secondary)]">{pixelCount.toLocaleString()} pixels</span>
                <span className="font-medium">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
} 