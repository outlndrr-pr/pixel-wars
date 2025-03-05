'use client';

import { usePixelWar } from '../contexts/PixelWarContext';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TeamSelector() {
  const { teams, user, joinTeam, getTeamPixelCount } = usePixelWar();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {teams.map((team) => (
          <Button
            key={team.id}
            variant={user?.teamId === team.id ? "default" : "outline"}
            className={cn(
              "h-auto py-4 flex flex-col items-center gap-2",
              user?.teamId === team.id && "ring-2 ring-offset-2 ring-primary"
            )}
            onClick={() => joinTeam(team.id)}
          >
            <div 
              className="w-6 h-6 rounded-full" 
              style={{ backgroundColor: team.color }}
            />
            <span className="font-medium">{team.name}</span>
            <span className="text-xs text-muted-foreground">
              {getTeamPixelCount(team.id)} pixels
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
} 