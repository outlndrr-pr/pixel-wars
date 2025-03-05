'use client';

import { usePixelWar } from '../contexts/PixelWarContext';
import { EventType } from '../types';
import { Card, Badge, ProgressBar } from './ui';

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
    <Card title="Status" className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        {user?.teamId ? (
          canPlacePixel ? (
            <Badge variant="success">Ready to place</Badge>
          ) : (
            <Badge variant="warning">Cooldown: {cooldownSeconds}s</Badge>
          )
        ) : (
          <Badge variant="default">Join a team first</Badge>
        )}
      </div>
      
      {/* Cooldown progress bar */}
      {user?.teamId && !canPlacePixel && cooldownRemaining > 0 && (
        <div className="mb-4">
          <ProgressBar 
            value={100 - (cooldownRemaining / 10000 * 100)} 
            max={100}
            variant="info"
          />
        </div>
      )}
      
      {/* Instructions */}
      <div className="mb-6 text-sm text-[var(--color-text-secondary)]">
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
          <div className="border border-[var(--color-border)] rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-3">Power-ups</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">💣</span>
                  <span className="text-sm font-medium">Color Bomb</span>
                </div>
                
                {canUseColorBomb ? (
                  <Badge variant="success" className="text-xs">Ready to use!</Badge>
                ) : (
                  <>
                    <ProgressBar
                      value={100 - (colorBombCooldown / 600000 * 100)}
                      max={100}
                      size="sm"
                    />
                    <div className="text-xs text-[var(--color-text-tertiary)] mt-1">
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
                  <Badge variant="success" className="text-xs">Ready to use!</Badge>
                ) : (
                  <>
                    <ProgressBar
                      value={100 - (territoryShieldCooldown / 900000 * 100)}
                      max={100}
                      size="sm"
                    />
                    <div className="text-xs text-[var(--color-text-tertiary)] mt-1">
                      Available in {formatTime(territoryShieldCooldown)}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Events section */}
        <div className="border border-[var(--color-border)] rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-3">Events</h4>
          
          {/* Active events */}
          {activeEvents.length > 0 ? (
            <div className="mb-3">
              <div className="text-xs font-medium text-[var(--color-text-tertiary)] mb-2">Active Now:</div>
              <div className="space-y-2">
                {activeEvents.map(event => (
                  <div key={event.type} className="flex items-center text-sm bg-[var(--color-info)] bg-opacity-10 p-2 rounded-md border border-[var(--color-info)] border-opacity-20">
                    <span className="text-lg mr-2">{eventIcons[event.type]}</span>
                    <span className="text-[var(--color-info)] dark:text-blue-300 text-sm">{event.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-[var(--color-text-secondary)] mb-3">No active events</div>
          )}
          
          {/* Upcoming events */}
          {upcomingEvents.length > 0 && (
            <div>
              <div className="text-xs font-medium text-[var(--color-text-tertiary)] mb-2">Coming Soon:</div>
              <div className="space-y-2">
                {upcomingEvents.slice(0, 2).map(event => (
                  <div key={event.type} className="flex justify-between items-center text-sm p-2 rounded-md border border-[var(--color-border)] bg-[var(--color-background)]">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{eventIcons[event.type]}</span>
                      <span className="font-medium">{event.type}</span>
                    </div>
                    <span className="text-xs text-[var(--color-text-tertiary)]">
                      in {formatTime(event.nextOccurrence! - Date.now())}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
} 