// Team definitions
export type TeamId = 'red' | 'blue' | 'green' | 'yellow';

export interface Team {
  id: TeamId;
  name: string;
  color: string;
}

// Pixel data structure
export interface Pixel {
  x: number;
  y: number;
  color: string;
  teamId: TeamId | null;
  lastUpdated: number; // timestamp
}

// Canvas state
export interface CanvasState {
  width: number;
  height: number;
  pixels: Record<string, Pixel>; // key is "x,y"
  lastUpdate: number;
}

// User state
export interface User {
  id: string;
  teamId: TeamId | null;
  lastPixelPlacement: number | null;
  pixelsPlaced: number;
  achievements: Achievement[];
}

// Event types
export type EventType = 'goldRush' | 'pixelStorm' | 'territoryWars';

export interface TimedEvent {
  type: EventType;
  active: boolean;
  startTime: number | null;
  endTime: number | null;
  nextOccurrence: number | null;
  description: string;
  affectedAreas?: { x: number, y: number, width: number, height: number }[];
}

// Power-up types
export type PowerUpType = 'colorBomb' | 'territoryShield';

export interface PowerUp {
  type: PowerUpType;
  teamId: TeamId | null;
  userId: string | null;
  startTime: number | null;
  endTime: number | null;
  cooldownEnd: number | null;
  affectedArea?: { x: number, y: number, width: number, height: number };
}

// Achievement types
export type AchievementType = 
  | 'pixelMilestone'   // Based on number of pixels placed
  | 'territoryControl' // Based on controlling certain areas
  | 'patternBuilder';  // Based on creating specific patterns

export interface Achievement {
  id: string;
  type: AchievementType;
  title: string;
  description: string;
  completed: boolean;
  progress: number;
  maxProgress: number;
  reward?: string;
  date?: number;
} 