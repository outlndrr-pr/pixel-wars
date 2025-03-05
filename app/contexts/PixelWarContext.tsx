'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Team, TeamId, CanvasState, Pixel, User, EventType, TimedEvent, PowerUp, PowerUpType, Achievement, AchievementType } from '../types';
import { 
  signInAnonymousUser, 
  onAuthChange, 
  getCurrentUser 
} from '../firebase/auth';
import {
  firebaseDB as db,
  firebaseAuth as auth,
  COLLECTIONS,
  convertFromFirestore,
  convertToFirestore,
  getUserRef,
  getPixelRef,
  getEventRef,
  getPowerUpRef
} from '../firebase/firestore';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

// Default teams
const TEAMS: Team[] = [
  { id: 'red', name: 'Red Team', color: '#FF5555' },
  { id: 'blue', name: 'Blue Team', color: '#5555FF' },
  { id: 'green', name: 'Green Team', color: '#55AA55' },
  { id: 'yellow', name: 'Yellow Team', color: '#FFFF55' },
];

// Default canvas size
const DEFAULT_WIDTH = 100;
const DEFAULT_HEIGHT = 100;

// Cooldown time in milliseconds (10 seconds)
const PIXEL_PLACEMENT_COOLDOWN = 10000;

// Power-up cooldowns
const COLOR_BOMB_COOLDOWN = 600000; // 10 minutes
const TERRITORY_SHIELD_COOLDOWN = 900000; // 15 minutes

// Event settings
const EVENT_DURATION = 60000; // 1 minute
const MIN_EVENT_INTERVAL = 300000; // 5 minutes
const MAX_EVENT_INTERVAL = 1200000; // 20 minutes

// Default events
const DEFAULT_EVENTS: TimedEvent[] = [
  {
    type: 'goldRush',
    active: false,
    startTime: null,
    endTime: null,
    nextOccurrence: null,
    description: 'Gold pixels are worth double territory points!',
  },
  {
    type: 'pixelStorm',
    active: false,
    startTime: null,
    endTime: null,
    nextOccurrence: null,
    description: 'Cooldown reduced by 50% for all players!',
  },
  {
    type: 'territoryWars',
    active: false,
    startTime: null,
    endTime: null,
    nextOccurrence: null,
    description: 'Selected areas are worth triple territory points!',
    affectedAreas: [],
  },
];

// Default achievements
const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  // Pixel Milestone achievements
  {
    id: 'pixel-10',
    type: 'pixelMilestone',
    title: 'Pixel Beginner',
    description: 'Place 10 pixels on the canvas',
    completed: false,
    progress: 0,
    maxProgress: 10,
    reward: 'Unlock basic colors',
  },
  {
    id: 'pixel-50',
    type: 'pixelMilestone',
    title: 'Pixel Enthusiast',
    description: 'Place 50 pixels on the canvas',
    completed: false,
    progress: 0,
    maxProgress: 50,
    reward: 'Reduced cooldown time (9s)',
  },
  {
    id: 'pixel-100',
    type: 'pixelMilestone',
    title: 'Pixel Master',
    description: 'Place 100 pixels on the canvas',
    completed: false,
    progress: 0,
    maxProgress: 100,
    reward: 'Color Bomb unlocked',
  },
  
  // Territory Control achievements
  {
    id: 'territory-10',
    type: 'territoryControl',
    title: 'Territory Claimer',
    description: 'Help your team control 10% of the canvas',
    completed: false,
    progress: 0,
    maxProgress: 10,
    reward: 'Team color boost',
  },
  {
    id: 'territory-25',
    type: 'territoryControl',
    title: 'Territory Dominator',
    description: 'Help your team control 25% of the canvas',
    completed: false,
    progress: 0,
    maxProgress: 25,
    reward: 'Territory Shield unlocked',
  },
  
  // Pattern Builder achievements
  {
    id: 'pattern-square',
    type: 'patternBuilder',
    title: 'Square Builder',
    description: 'Create a 3x3 square of the same color',
    completed: false,
    progress: 0,
    maxProgress: 1,
    reward: 'Pattern recognition badge',
  },
  {
    id: 'pattern-line',
    type: 'patternBuilder',
    title: 'Line Artist',
    description: 'Create a straight line of 5 pixels',
    completed: false,
    progress: 0,
    maxProgress: 1,
    reward: 'Line drawing tool',
  },
];

// Context type
interface PixelWarContextType {
  canvasState: CanvasState;
  user: User;
  teams: Team[];
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  joinTeam: (teamId: TeamId) => void;
  placePixel: (x: number, y: number) => void;
  canPlacePixel: boolean;
  cooldownRemaining: number;
  getTeamPixelCount: (teamId: TeamId) => number;
  events: TimedEvent[];
  activePowerUps: PowerUp[];
  useColorBomb: (x: number, y: number) => void;
  useTerritoryShield: (x: number, y: number) => void;
  canUseColorBomb: boolean;
  canUseTerritoryShield: boolean;
  colorBombCooldown: number;
  territoryShieldCooldown: number;
  recentAchievements: Achievement[];
  clearRecentAchievements: () => void;
}

const PixelWarContext = createContext<PixelWarContextType | null>(null);

// Generate initial empty canvas
function createEmptyCanvas(): CanvasState {
  return {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    pixels: {},
    lastUpdate: Date.now(),
  };
}

// Generate random user ID
function generateUserId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function PixelWarProvider({ children }: { children: ReactNode }) {
  const [canvasState, setCanvasState] = useState<CanvasState>(() => createEmptyCanvas());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(TEAMS[0].color);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  
  // Timed events state
  const [events, setEvents] = useState<TimedEvent[]>(DEFAULT_EVENTS);
  
  // Power-ups state
  const [activePowerUps, setActivePowerUps] = useState<PowerUp[]>([]);
  const [colorBombCooldown, setColorBombCooldown] = useState<number>(0);
  const [territoryShieldCooldown, setTerritoryShieldCooldown] = useState<number>(0);
  
  // Keep track of recently earned achievements to display notifications
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  
  // Calculate if user can place a pixel (considering events)
  const canPlacePixel = (user?.teamId !== null && user?.teamId !== undefined) && cooldownRemaining === 0;
  
  // Calculate if user can use power-ups
  const canUseColorBomb = (user?.teamId !== null && user?.teamId !== undefined) && colorBombCooldown === 0;
  const canUseTerritoryShield = (user?.teamId !== null && user?.teamId !== undefined) && territoryShieldCooldown === 0;
  
  // Set isClient to true on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Subscribe to auth state changes
  useEffect(() => {
    if (!isClient) return;
    
    // Wait for auth and db to be available
    if (!auth || !db) {
      console.log('Waiting for Firebase Auth and Firestore to initialize...');
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 5000); // Safety timeout
      return () => clearTimeout(timer);
    }

    console.log('Setting up auth state listener');
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get or create user document
          const userRef = getUserRef(firebaseUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            // User exists, load their data
            setUser(convertFromFirestore.user(userDoc.data() as any));
          } else {
            // New user, create document
            const newUser: User = {
              id: firebaseUser.uid,
              teamId: null,
              lastPixelPlacement: null,
              pixelsPlaced: 0,
              achievements: DEFAULT_ACHIEVEMENTS,
            };
            await setDoc(userRef, convertToFirestore.user(newUser));
            setUser(newUser);
          }
        } catch (error) {
          console.error('Error handling user document:', error);
          setUser(null);
        }
      } else {
        // No user, try anonymous sign in
        try {
          console.log('No firebase user, attempting anonymous sign-in');
          await signInAnonymousUser();
        } catch (error) {
          console.error('Error signing in anonymously:', error);
          setUser(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isClient]);
  
  // Fix for the null user.teamId error by initializing with a fallback value
  // Add this right after the above effect
  useEffect(() => {
    // Initialize with a default user to prevent null exceptions during rendering
    if (!user && !isLoading && isClient) {
      console.log('Initializing with default user to prevent errors');
      setUser({
        id: generateUserId(),
        teamId: null,
        lastPixelPlacement: null,
        pixelsPlaced: 0,
        achievements: DEFAULT_ACHIEVEMENTS,
      });
    }
  }, [user, isLoading, isClient]);

  // Subscribe to canvas updates
  useEffect(() => {
    if (!isClient || !db) return;

    const pixelsRef = collection(db, COLLECTIONS.PIXELS);
    const unsubscribe = onSnapshot(pixelsRef, (snapshot) => {
      const newPixels: Record<string, Pixel> = {};
      
      snapshot.forEach((doc) => {
        const pixel = convertFromFirestore.pixel(doc.data() as any);
        newPixels[`${pixel.x},${pixel.y}`] = pixel;
      });
      
      setCanvasState(prev => ({
        ...prev,
        pixels: newPixels,
        lastUpdate: Date.now(),
      }));
    });

    return () => unsubscribe();
  }, [isClient]);

  // Subscribe to events
  useEffect(() => {
    if (!isClient || !db) return;

    const eventsRef = collection(db, COLLECTIONS.EVENTS);
    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      const newEvents: TimedEvent[] = [];
      
      snapshot.forEach((doc) => {
        newEvents.push(convertFromFirestore.event(doc.data() as any));
      });
      
      setEvents(newEvents);
    });

    return () => unsubscribe();
  }, [isClient]);

  // Subscribe to power-ups
  useEffect(() => {
    if (!isClient || !db || !user?.teamId) return;

    const powerUpsRef = collection(db, COLLECTIONS.POWERUPS);
    // Create a new Date object for the current time and convert to Firestore Timestamp
    const now = new Date();
    const nowTimestamp = Timestamp.fromDate(now);
    
    const activeQuery = query(
      powerUpsRef,
      where('endTime', '>', nowTimestamp)
    );

    const unsubscribe = onSnapshot(activeQuery, (snapshot) => {
      const newPowerUps: PowerUp[] = [];
      
      snapshot.forEach((doc) => {
        newPowerUps.push(convertFromFirestore.powerUp(doc.data() as any));
      });
      
      setActivePowerUps(newPowerUps);
    });

    return () => unsubscribe();
  }, [isClient, user?.teamId]);

  // Join a team
  const joinTeam = async (teamId: TeamId) => {
    if (!user) return;

    const userRef = getUserRef(user.id);
    const newUser = { ...user, teamId };
    
    await updateDoc(userRef, convertToFirestore.user(newUser) as any);
    setUser(newUser);
    
    // Set initial color to team color
    const team = TEAMS.find(t => t.id === teamId);
    if (team) {
      setSelectedColor(team.color);
    }
  };
  
  // Place a pixel
  const placePixel = async (x: number, y: number) => {
    if (!canPlacePixel || !user?.teamId) return;

    const now = Date.now();
    const key = `${x},${y}`;

    // Create a new pixel
    const newPixel: Pixel = {
      x,
      y,
      color: selectedColor,
      teamId: user.teamId,
      lastUpdated: now,
    };

    // Update Firestore
    const pixelRef = getPixelRef(x, y);
    await setDoc(pixelRef, convertToFirestore.pixel(newPixel));

    // Update user's last placement and pixels placed
    const userRef = getUserRef(user.id);
    await updateDoc(userRef, {
      lastPixelPlacement: serverTimestamp(),
      pixelsPlaced: user.pixelsPlaced + 1,
    });

    // Achievement checks will be handled by a Firestore trigger
  };
  
  // Helper function to check for a square pattern
  const checkForSquarePattern = (pixels: Pixel[], size: number): boolean => {
    for (let i = 0; i < pixels.length; i++) {
      const centerX = pixels[i].x;
      const centerY = pixels[i].y;
      const color = pixels[i].color;
      
      let foundSquare = true;
      
      // Check if all pixels in the square exist with the same color
      for (let dx = 0; dx < size; dx++) {
        for (let dy = 0; dy < size; dy++) {
          const hasPixel = pixels.some(p => 
            p.x === centerX + dx && 
            p.y === centerY + dy && 
            p.color === color
          );
          
          if (!hasPixel) {
            foundSquare = false;
            break;
          }
        }
        
        if (!foundSquare) break;
      }
      
      if (foundSquare) return true;
    }
    
    return false;
  };
  
  // Helper function to check for a line pattern
  const checkForLinePattern = (pixels: Pixel[], length: number): boolean => {
    // Check for horizontal lines
    for (let i = 0; i < pixels.length; i++) {
      const startX = pixels[i].x;
      const y = pixels[i].y;
      const color = pixels[i].color;
      
      let foundLine = true;
      
      for (let dx = 0; dx < length; dx++) {
        const hasPixel = pixels.some(p => 
          p.x === startX + dx && 
          p.y === y && 
          p.color === color
        );
        
        if (!hasPixel) {
          foundLine = false;
          break;
        }
      }
      
      if (foundLine) return true;
    }
    
    // Check for vertical lines
    for (let i = 0; i < pixels.length; i++) {
      const x = pixels[i].x;
      const startY = pixels[i].y;
      const color = pixels[i].color;
      
      let foundLine = true;
      
      for (let dy = 0; dy < length; dy++) {
        const hasPixel = pixels.some(p => 
          p.x === x && 
          p.y === startY + dy && 
          p.color === color
        );
        
        if (!hasPixel) {
          foundLine = false;
          break;
        }
      }
      
      if (foundLine) return true;
    }
    
    return false;
  };
  
  // Use color bomb power-up (place 4 pixels in a 2x2 pattern)
  const useColorBomb = (x: number, y: number) => {
    if (!canUseColorBomb || !user?.teamId) return;
    
    const now = Date.now();
    
    // Place 4 pixels in a 2x2 pattern
    setCanvasState(prev => {
      const newPixels = { ...prev.pixels };
      
      for (let dx = 0; dx < 2; dx++) {
        for (let dy = 0; dy < 2; dy++) {
          const nx = x + dx;
          const ny = y + dy;
          
          // Skip if out of bounds
          if (nx < 0 || nx >= prev.width || ny < 0 || ny >= prev.height) continue;
          
          const key = `${nx},${ny}`;
          
          newPixels[key] = {
            x: nx,
            y: ny,
            color: selectedColor,
            teamId: user.teamId,
            lastUpdated: now,
          };
        }
      }
      
      const newState = {
        ...prev,
        pixels: newPixels,
        lastUpdate: now,
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('pixelwar_canvas', JSON.stringify(newState));
      }
      
      return newState;
    });
    
    // Add active power-up
    const powerUp: PowerUp = {
      type: 'colorBomb',
      teamId: user.teamId,
      userId: user.id,
      startTime: now,
      endTime: now, // Instant effect
      cooldownEnd: now + COLOR_BOMB_COOLDOWN,
      affectedArea: { x, y, width: 2, height: 2 },
    };
    
    setActivePowerUps(prev => prev ? [...prev, powerUp] : [powerUp]);
    
    // Set cooldown
    setColorBombCooldown(COLOR_BOMB_COOLDOWN);
  };
  
  // Use territory shield power-up
  const useTerritoryShield = (x: number, y: number) => {
    if (!canUseTerritoryShield || !user?.teamId) return;
    
    const now = Date.now();
    const shieldDuration = 60000; // 1 minute
    
    // Add active power-up
    const powerUp: PowerUp = {
      type: 'territoryShield',
      teamId: user.teamId,
      userId: user.id,
      startTime: now,
      endTime: now + shieldDuration,
      cooldownEnd: now + TERRITORY_SHIELD_COOLDOWN,
      affectedArea: { x: x - 2, y: y - 2, width: 5, height: 5 }, // 5x5 area
    };
    
    setActivePowerUps(prev => prev ? [...prev, powerUp] : [powerUp]);
    
    // Set cooldown
    setTerritoryShieldCooldown(TERRITORY_SHIELD_COOLDOWN);
  };
  
  // Calculate number of pixels owned by a team
  const getTeamPixelCount = (teamId: TeamId): number => {
    return Object.values(canvasState.pixels).filter(pixel => pixel.teamId === teamId).length;
  };
  
  // Initialize event timers
  useEffect(() => {
    const now = Date.now();
    
    // Set random next occurrence for each event
    setEvents(prev => 
      prev ? prev.map(event => ({
        ...event,
        nextOccurrence: now + MIN_EVENT_INTERVAL + Math.random() * (MAX_EVENT_INTERVAL - MIN_EVENT_INTERVAL),
      })) : []
    );
  }, []);
  
  // Update events and power-ups status
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      
      // Update events
      setEvents(prev => 
        prev ? prev.map(event => {
          // If the event is active and past end time, deactivate it
          if (event.active && event.endTime && now > event.endTime) {
            return {
              ...event,
              active: false,
              startTime: null,
              endTime: null,
              nextOccurrence: now + MIN_EVENT_INTERVAL + Math.random() * (MAX_EVENT_INTERVAL - MIN_EVENT_INTERVAL),
            };
          }
          
          // If the event is not active and it's time for it to occur
          if (!event.active && event.nextOccurrence && now > event.nextOccurrence) {
            // For territory wars, generate random affected areas
            let affectedAreas = event.affectedAreas;
            
            if (event.type === 'territoryWars') {
              // Generate 1-3 random areas of size 10x10
              const numAreas = 1 + Math.floor(Math.random() * 3);
              affectedAreas = [];
              
              for (let i = 0; i < numAreas; i++) {
                const areaSize = 10;
                const x = Math.floor(Math.random() * (DEFAULT_WIDTH - areaSize));
                const y = Math.floor(Math.random() * (DEFAULT_HEIGHT - areaSize));
                
                affectedAreas.push({ x, y, width: areaSize, height: areaSize });
              }
            }
            
            return {
              ...event,
              active: true,
              startTime: now,
              endTime: now + EVENT_DURATION,
              nextOccurrence: null,
              affectedAreas,
            };
          }
          
          return event;
        }) : []
      );
      
      // Update power-ups
      setActivePowerUps(prev => 
        prev ? prev.filter(powerUp => !powerUp.endTime || now <= powerUp.endTime) : []
      );
      
      // Update cooldowns
      if (colorBombCooldown > 0) {
        setColorBombCooldown(prev => Math.max(0, prev - 100));
      }
      
      if (territoryShieldCooldown > 0) {
        setTerritoryShieldCooldown(prev => Math.max(0, prev - 100));
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [colorBombCooldown, territoryShieldCooldown]);
  
  // Update cooldown timer (considering pixel storm event)
  useEffect(() => {
    if (!user) return; // Early return if no user

    const interval = setInterval(() => {
      if (!user.lastPixelPlacement) return;
      
      const now = Date.now();
      let cooldownTime = PIXEL_PLACEMENT_COOLDOWN;
      
      // Check if pixel storm is active
      const pixelStorm = events.find(e => e.type === 'pixelStorm' && e.active);
      if (pixelStorm) {
        cooldownTime = Math.floor(cooldownTime * 0.5); // 50% reduction
      }
      
      const elapsed = now - user.lastPixelPlacement;
      const remaining = Math.max(0, cooldownTime - elapsed);
      
      setCooldownRemaining(remaining);
    }, 100);
    
    return () => clearInterval(interval);
  }, [user, events]); // Fixed dependency array
  
  // Clear recent achievements (after displaying notifications)
  const clearRecentAchievements = () => {
    setRecentAchievements([]);
  };
  
  if (!isClient || isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Initializing user...</div>;
  }

  return (
    <PixelWarContext.Provider
      value={{
        canvasState,
        user,
        teams: TEAMS,
        selectedColor,
        setSelectedColor,
        joinTeam,
        placePixel,
        canPlacePixel,
        cooldownRemaining,
        getTeamPixelCount,
        events,
        activePowerUps,
        useColorBomb,
        useTerritoryShield,
        canUseColorBomb,
        canUseTerritoryShield,
        colorBombCooldown,
        territoryShieldCooldown,
        recentAchievements,
        clearRecentAchievements,
      }}
    >
      {children}
    </PixelWarContext.Provider>
  );
}

export function usePixelWar() {
  const context = useContext(PixelWarContext);
  if (!context) {
    throw new Error('usePixelWar must be used within a PixelWarProvider');
  }
  return context;
} 