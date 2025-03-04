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
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Select Your Team</h2>
      
      {user.teamId ? (
        <>
          <div className="mb-4 p-3 border rounded-md bg-gray-50">
            <p className="font-medium">
              You are part of{' '}
              <span style={{ color: teams.find(t => t.id === user.teamId)?.color }}>
                {teams.find(t => t.id === user.teamId)?.name}
              </span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              You can switch teams, but it's better to stick with one team for coordination!
            </p>
          </div>
          
          <h3 className="font-semibold mb-2">Territory Control</h3>
        </>
      ) : (
        <p className="mb-4 text-gray-700">Join a team to place pixels on the canvas!</p>
      )}
      
      <div className="space-y-4">
        {sortedTeams.map(team => {
          const pixelCount = getTeamPixelCount(team.id);
          const percentage = totalPixels === 0 ? 0 : Math.round((pixelCount / totalPixels) * 100);
          
          return (
            <div key={team.id} className="border rounded-md p-3 transition hover:shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: team.color }} 
                  />
                  <h4 className="font-medium">{team.name}</h4>
                </div>
                
                <button
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    user.teamId === team.id
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                  onClick={() => joinTeam(team.id as TeamId)}
                  disabled={user.teamId === team.id}
                >
                  {user.teamId === team.id ? 'Current Team' : 'Join'}
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: team.color
                  }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>{pixelCount} pixels</span>
                <span>{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 