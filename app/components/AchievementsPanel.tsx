'use client';

import { usePixelWar } from "../contexts/PixelWarContext"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Map achievement types to human-readable names
const typeNames: Record<string, string> = {
  pixelMilestone: 'Pixel Milestones',
  territoryControl: 'Territory Control',
  patternBuilder: 'Pattern Builder'
};

// Map achievement types to icons
const typeIcons: Record<string, string> = {
  pixelMilestone: '🎯',
  territoryControl: '🏆',
  patternBuilder: '🧩'
};

const ACHIEVEMENTS = [
  {
    id: "first-pixel",
    type: "pixelMilestone",
    title: "First Pixel",
    description: "Place your first pixel on the canvas",
    icon: "🎯"
  },
  {
    id: "team-player",
    type: "territoryControl",
    title: "Team Player",
    description: "Join a team and contribute to their territory",
    icon: "🏆"
  },
  {
    id: "pixel-master",
    type: "pixelMilestone",
    title: "Pixel Master",
    description: "Place 100 pixels on the canvas",
    icon: "🎯"
  },
  {
    id: "territory-defender",
    type: "territoryControl",
    title: "Territory Defender",
    description: "Successfully defend your team's territory",
    icon: "🛡️"
  }
]

export function AchievementsPanel() {
  const { user } = usePixelWar()
  const unlockedAchievements = user?.achievements?.map(a => a.id) || []

  return (
    <div className="space-y-4">
      {ACHIEVEMENTS.map((achievement) => {
        const isUnlocked = unlockedAchievements.includes(achievement.id)
        
        return (
          <div
            key={achievement.id}
            className={cn(
              "p-4 rounded-lg border",
              isUnlocked 
                ? "bg-primary/5 border-primary/20" 
                : "bg-muted/50 border-muted"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{achievement.icon}</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium leading-none">
                    {achievement.title}
                  </h3>
                  <Badge variant={isUnlocked ? "default" : "secondary"}>
                    {isUnlocked ? "Unlocked" : "Locked"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
} 