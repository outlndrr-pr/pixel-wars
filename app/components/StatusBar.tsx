'use client';

import { usePixelWar } from '../contexts/PixelWarContext';
import { EventType } from '../types';

// Helper function to format time in MM:SS
function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Event icons mapping
const eventIcons: Record<EventType, string> = {
  goldRush: '⭐',
  pixelStorm: '⚡',
  territoryWars: '🏆'
};

export function StatusBar() {
  const { 
    cooldownRemaining, 
    canPlacePixel, 
    user, 
    events, 
    colorBombCooldown,
    territoryShieldCooldown,
    canUseColorBomb,
    canUseTerritoryShield
  } = usePixelWar();
  
  // Format cooldown as seconds
  const cooldownSeconds = Math.ceil(cooldownRemaining / 1000);
  
  // Get upcoming events
  const upcomingEvents = events
    .filter(event => !event.active && event.nextOccurrence)
    .sort((a, b) => (a.nextOccurrence || 0) - (b.nextOccurrence || 0));
  
  // Get active events
  const activeEvents = events.filter(event => event.active);
  
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Status</h3>
        
        {user?.teamId ? (
          canPlacePixel ? (
            <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full font-medium">
              Ready to place
            </div>
          ) : (
            <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-sm rounded-full font-medium">
              Cooldown: {cooldownSeconds}s
            </div>
          )
        ) : (
          <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full font-medium">
            Join a team first
          </div>
        )}
      </div>
      
      {/* Cooldown progress bar */}
      {user?.teamId && !canPlacePixel && cooldownRemaining > 0 && (
        <div className="mb-4">
          <div className="h-2 bg-[var(--secondary)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--primary)] transition-all linear"
              style={{ 
                width: `${100 - (cooldownRemaining / 10000 * 100)}%`
              }}
            />
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        {!user?.teamId ? (
          <p>Select a team to start placing pixels.</p>
        ) : canPlacePixel ? (
          <p>Click on the canvas to place a pixel. Each pixel helps your team control territory.</p>
        ) : (
          <p>Please wait before placing another pixel. Each team member can place a pixel every 10 seconds.</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Power-ups section */}
        {user?.teamId && (
          <div className="border border-[var(--border)] rounded-lg p-4">
            <h4 className="font-bold text-sm mb-3">Power-ups</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">💣</span>
                  <span className="text-sm font-medium">Color Bomb</span>
                </div>
                
                {canUseColorBomb ? (
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">Ready to use!</div>
                ) : (
                  <>
                    <div className="h-2 bg-[var(--secondary)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[var(--primary)] transition-all linear"
                        style={{ 
                          width: `${100 - (colorBombCooldown / 600000 * 100)}%`
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Available in {formatTime(colorBombCooldown)}
                    </div>
                  </>
                )}
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">🛡️</span>
                  <span className="text-sm font-medium">Territory Shield</span>
                </div>
                
                {canUseTerritoryShield ? (
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">Ready to use!</div>
                ) : (
                  <>
                    <div className="h-2 bg-[var(--secondary)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[var(--primary)] transition-all linear"
                        style={{ 
                          width: `${100 - (territoryShieldCooldown / 900000 * 100)}%`
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Available in {formatTime(territoryShieldCooldown)}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Events section */}
        <div className="border border-[var(--border)] rounded-lg p-4">
          <h4 className="font-bold text-sm mb-3">Events</h4>
          
          {/* Active events */}
          {activeEvents.length > 0 ? (
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Active Now:</div>
              <div className="space-y-2">
                {activeEvents.map(event => (
                  <div key={event.type} className="flex items-center text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md border border-blue-100 dark:border-blue-800/30">
                    <span className="text-lg mr-2">{eventIcons[event.type]}</span>
                    <span className="text-blue-800 dark:text-blue-300 text-sm">{event.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">No active events</div>
          )}
          
          {/* Upcoming events */}
          {upcomingEvents.length > 0 && (
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Coming Soon:</div>
              <div className="space-y-2">
                {upcomingEvents.slice(0, 2).map(event => (
                  <div key={event.type} className="flex justify-between items-center text-sm p-2 rounded-md border border-[var(--border)] bg-[var(--secondary)]">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{eventIcons[event.type]}</span>
                      <span className="font-medium">{event.type}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      in {formatTime(event.nextOccurrence! - Date.now())}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 