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
    <div className="bg-white p-3 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Status</h3>
        
        {user.teamId ? (
          canPlacePixel ? (
            <div className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              Ready to place
            </div>
          ) : (
            <div className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
              Cooldown: {cooldownSeconds}s
            </div>
          )
        ) : (
          <div className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
            Join a team first
          </div>
        )}
      </div>
      
      {/* Cooldown progress bar */}
      {user.teamId && !canPlacePixel && cooldownRemaining > 0 && (
        <div className="mt-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all linear"
              style={{ 
                width: `${100 - (cooldownRemaining / 10000 * 100)}%`
              }}
            />
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div className="mt-3 text-sm text-gray-600">
        {!user.teamId ? (
          <p>Select a team to start placing pixels.</p>
        ) : canPlacePixel ? (
          <p>Click on the canvas to place a pixel. Each pixel you place helps your team control territory.</p>
        ) : (
          <p>Please wait before placing another pixel. Each team member can place a pixel every 10 seconds.</p>
        )}
      </div>
      
      {/* Power-ups section */}
      {user.teamId && (
        <div className="mt-4 border-t pt-3">
          <h4 className="font-semibold mb-2">Power-ups</h4>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <span className="text-lg mr-1">💣</span>
                <span className="text-sm font-medium">Color Bomb</span>
              </div>
              
              {canUseColorBomb ? (
                <div className="text-xs text-green-600">Ready to use!</div>
              ) : (
                <>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all linear"
                      style={{ 
                        width: `${100 - (colorBombCooldown / 600000 * 100)}%`
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Available in {formatTime(colorBombCooldown)}
                  </div>
                </>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <span className="text-lg mr-1">🛡️</span>
                <span className="text-sm font-medium">Territory Shield</span>
              </div>
              
              {canUseTerritoryShield ? (
                <div className="text-xs text-green-600">Ready to use!</div>
              ) : (
                <>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all linear"
                      style={{ 
                        width: `${100 - (territoryShieldCooldown / 900000 * 100)}%`
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Available in {formatTime(territoryShieldCooldown)}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Events section */}
      <div className="mt-4 border-t pt-3">
        <h4 className="font-semibold mb-2">Events</h4>
        
        {/* Active events */}
        {activeEvents.length > 0 ? (
          <div className="mb-3">
            <div className="text-sm font-medium mb-1">Active Now:</div>
            <div className="space-y-1">
              {activeEvents.map(event => (
                <div key={event.type} className="flex items-center text-sm bg-blue-50 p-2 rounded">
                  <span className="text-lg mr-2">{eventIcons[event.type]}</span>
                  <span>{event.description}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 mb-2">No active events</div>
        )}
        
        {/* Upcoming events */}
        {upcomingEvents.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-1">Coming Soon:</div>
            <div className="space-y-1">
              {upcomingEvents.slice(0, 2).map(event => (
                <div key={event.type} className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{eventIcons[event.type]}</span>
                    <span>{event.type}</span>
                  </div>
                  <span className="text-gray-500">
                    in {formatTime(event.nextOccurrence! - Date.now())}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 