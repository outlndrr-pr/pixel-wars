'use client';

import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { initializeSocket, placePixel as socketPlacePixel, onPixelUpdate } from '@/lib/socket';
import { useSession } from 'next-auth/react';

// Canvas size
export const CANVAS_SIZE = 100;

// Types
export type Pixel = {
  color: string;
  lastUpdated: number;
  deviceType: string;
};

type PixelUpdate = {
  x: number;
  y: number;
  color: string;
  timestamp: number;
  user: string;
};

type CanvasState = {
  pixels: Record<string, Pixel>;
  loading: boolean;
  selectedColor: string;
  cooldown: {
    active: boolean;
    endsAt: number;
  };
};

type CanvasContextType = {
  canvasState: CanvasState;
  setSelectedColor: (color: string) => void;
  placePixel: (x: number, y: number) => void;
  canPlacePixel: () => boolean;
  timeUntilNextPixel: () => number;
  formattedTime: string;
  getPixelAt: (x: number, y: number) => Pixel | undefined;
};

export const DEFAULT_COLORS = [
  '#FFFFFF', // White
  '#E4E4E4', // Light Gray
  '#888888', // Gray
  '#222222', // Dark Gray
  '#000000', // Black
  '#FFA7D1', // Pink
  '#E50000', // Red
  '#E59500', // Orange
  '#A06A42', // Brown
  '#E5D900', // Yellow
  '#94E044', // Light Green
  '#02BE01', // Green
  '#00D3DD', // Turquoise
  '#0083C7', // Blue
  '#0000EA', // Dark Blue
  '#820080', // Purple
];

// Updated for different cooldowns based on auth status
const getCooldownTime = (isAnonymous: boolean) => {
  if (isAnonymous) {
    return parseInt(process.env.NEXT_PUBLIC_COOLDOWN_ANON || '300000', 10); // 5 minutes for anonymous
  }
  return parseInt(process.env.NEXT_PUBLIC_COOLDOWN_AUTH || '300000', 10); // 5 minutes for authenticated
};

const initialState: CanvasState = {
  pixels: {},
  loading: true,
  selectedColor: DEFAULT_COLORS[0],
  cooldown: {
    active: false,
    endsAt: 0,
  },
};

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
  const [canvasState, setCanvasState] = useState<CanvasState>(initialState);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  
  // Check if user is anonymous
  const isAnonymous = (session?.user as any)?.isAnonymous || !session;
  
  // Initialize socket connection
  useEffect(() => {
    const socket = initializeSocket();
    
    // Listen for pixel updates
    const unsubscribe = onPixelUpdate((pixelData: PixelUpdate) => {
      setCanvasState(prev => ({
        ...prev,
        pixels: {
          ...prev.pixels,
          [`${pixelData.x}-${pixelData.y}`]: {
            color: pixelData.color,
            lastUpdated: pixelData.timestamp,
            deviceType: 'unknown'
          }
        }
      }));
    });
    
    // Clean up on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Load canvas data from localStorage (fallback when offline)
  useEffect(() => {
    try {
      const savedCanvas = localStorage.getItem('pixelCanvas');
      if (savedCanvas) {
        const pixels = JSON.parse(savedCanvas);
        setCanvasState(prev => ({
          ...prev,
          pixels,
          loading: false,
        }));
      } else {
        setCanvasState(prev => ({
          ...prev,
          loading: false
        }));
      }

      // Load the last cooldown from localStorage
      const savedCooldown = localStorage.getItem('pixelCooldown');
      if (savedCooldown) {
        const { endsAt } = JSON.parse(savedCooldown);
        if (endsAt > Date.now()) {
          setCanvasState((prev) => ({
            ...prev,
            cooldown: {
              active: true,
              endsAt,
            },
          }));
          setRemainingTime(endsAt - Date.now());
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      setCanvasState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Handle cooldown timer with real-time updates
  useEffect(() => {
    if (!canvasState.cooldown.active) {
      setRemainingTime(0);
      return;
    }

    // Update every second
    const timer = setInterval(() => {
      const timeLeft = canvasState.cooldown.endsAt - Date.now();
      
      if (timeLeft <= 0) {
        setCanvasState((prev) => ({
          ...prev,
          cooldown: {
            active: false,
            endsAt: 0,
          },
        }));
        localStorage.removeItem('pixelCooldown');
        setRemainingTime(0);
        clearInterval(timer);
      } else {
        setRemainingTime(timeLeft);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [canvasState.cooldown.active, canvasState.cooldown.endsAt]);

  const formatTime = (ms: number): string => {
    if (ms <= 0) return '0:00';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const setSelectedColor = (color: string) => {
    setCanvasState((prev) => ({
      ...prev,
      selectedColor: color,
    }));
  };

  const canPlacePixel = () => {
    return !canvasState.cooldown.active;
  };

  const timeUntilNextPixel = useCallback(() => {
    if (!canvasState.cooldown.active) return 0;
    const remaining = canvasState.cooldown.endsAt - Date.now();
    return remaining > 0 ? remaining : 0;
  }, [canvasState.cooldown]);

  const placePixel = useCallback((x: number, y: number) => {
    // Check if user can place a pixel
    if (!canPlacePixel()) return;
    
    const pixelData = {
      x,
      y,
      color: canvasState.selectedColor
    };
    
    // Send pixel to socket
    socketPlacePixel(pixelData);
    
    // Update local state immediately for responsive UI
    const newPixel: Pixel = {
      color: canvasState.selectedColor,
      lastUpdated: Date.now(),
      deviceType: typeof window !== 'undefined' ? 
        (window.innerWidth <= 768 ? 'mobile' : 'desktop') : 'unknown'
    };
    
    setCanvasState(prev => ({
      ...prev,
      pixels: {
        ...prev.pixels,
        [`${x}-${y}`]: newPixel
      },
      cooldown: {
        active: true,
        endsAt: Date.now() + getCooldownTime(isAnonymous)
      }
    }));
    
    // Save cooldown to localStorage
    localStorage.setItem(
      'pixelCooldown',
      JSON.stringify({ endsAt: Date.now() + getCooldownTime(isAnonymous) })
    );
  }, [canvasState.selectedColor, canPlacePixel, isAnonymous]);

  const getPixelAt = (x: number, y: number): Pixel | undefined => {
    const pixelKey = `${x}-${y}`;
    return canvasState.pixels[pixelKey];
  };

  return (
    <CanvasContext.Provider
      value={{
        canvasState,
        setSelectedColor,
        placePixel,
        canPlacePixel,
        timeUntilNextPixel,
        formattedTime: formatTime(remainingTime),
        getPixelAt,
      }}
    >
      {children}
      {error && (
        <div className="error-notification">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
    </CanvasContext.Provider>
  );
};

export const useCanvas = (): CanvasContextType => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
}; 