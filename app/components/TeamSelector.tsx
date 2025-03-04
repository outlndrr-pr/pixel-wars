'use client';

import { usePixelWar } from '../contexts/PixelWarContext';
import { TeamId } from '../types';

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
    <div className="card p-6">
      <h2 className="text-lg font-bold mb-4">Teams</h2>
      
      {user?.teamId ? (
        <div className="mb-5 p-4 rounded-lg bg-[var(--secondary)] border border-[var(--border)]">
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
          <p className="text-xs text-gray-500 dark:text-gray-400">
            You can switch teams, but it's better to stick with one for coordination.
          </p>
        </div>
      ) : (
        <div className="mb-5 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Join a team to start placing pixels on the canvas!
          </p>
        </div>
      )}
      
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Territory Control</h3>
      
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
                  ? 'border-2 border-[var(--primary)]' 
                  : 'border border-[var(--border)] hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: team.color }} 
                  />
                  <h4 className="font-medium">{team.name}</h4>
                </div>
                
                <button
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    isUserTeam
                      ? 'bg-[var(--secondary)] text-gray-500 dark:text-gray-400 cursor-default'
                      : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]'
                  }`}
                  onClick={() => joinTeam(team.id as TeamId)}
                  disabled={isUserTeam}
                  aria-label={isUserTeam ? 'Current team' : `Join ${team.name}`}
                >
                  {isUserTeam ? 'Current' : 'Join'}
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="h-2 bg-[var(--secondary)] rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: team.color
                  }}
                />
              </div>
              
              <div className="flex justify-between text-xs mt-2">
                <span className="text-gray-500 dark:text-gray-400">{pixelCount.toLocaleString()} pixels</span>
                <span className="font-medium">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 