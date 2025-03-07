'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Database, DatabaseReference } from 'firebase/database';
import { db } from '@/lib/firebase';
import { ref, onValue, set } from 'firebase/database';

// Canvas size
const CANVAS_SIZE = 100;

// Types
type Pixel = {
  color: string;
  lastUpdated: number;
  updatedBy?: string;
  deviceType: string;
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
  placePixel: (x: number, y: number) => Promise<void>;
  canPlacePixel: () => boolean;
  timeUntilNextPixel: () => number;
  formattedTime: string;
};

const DEFAULT_COLORS = [
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

// Default cooldown time in milliseconds (5 minutes)
const DEFAULT_COOLDOWN = 5 * 60 * 1000;

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
  const [error, setError] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  // Load the canvas data from Firebase
  useEffect(() => {
    console.log('Setting up Firebase canvas listener...');
    try {
      const canvasRef = ref(db, 'canvas');
      const unsubscribe = onValue(canvasRef, (snapshot) => {
        console.log('Received canvas update:', {
          exists: snapshot.exists(),
          numPixels: snapshot.exists() ? Object.keys(snapshot.val()).length : 0,
          timestamp: new Date().toISOString()
        });
        const data = snapshot.val() || {};
        setCanvasState((prev) => ({
          ...prev,
          pixels: data,
          loading: false,
        }));
      }, (error) => {
        console.error('Firebase canvas subscription error:', error);
        setError('Failed to connect to canvas data');
        setCanvasState(prev => ({ ...prev, loading: false }));
      });

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

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up Firebase listener:', error);
      setError('Failed to initialize canvas connection');
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

  const timeUntilNextPixel = () => {
    if (!canvasState.cooldown.active) return 0;
    return Math.max(0, canvasState.cooldown.endsAt - Date.now());
  };

  const placePixel = async (x: number, y: number) => {
    if (!canPlacePixel() || x < 0 || x >= CANVAS_SIZE || y < 0 || y >= CANVAS_SIZE) {
      console.log('Cannot place pixel:', { x, y, canPlace: canPlacePixel() });
      return;
    }

    const pixelKey = `${x}-${y}`;
    const pixelData: Pixel = {
      color: canvasState.selectedColor,
      lastUpdated: Date.now(),
      deviceType: typeof window !== 'undefined' ? 
        (window.innerWidth <= 768 ? 'mobile' : 'desktop') : 'unknown'
    };

    console.log('Attempting to place pixel:', {
      x,
      y,
      color: canvasState.selectedColor,
      deviceType: pixelData.deviceType,
      timestamp: new Date().toISOString()
    });

    try {
      // Update in Firebase
      await set(ref(db, `canvas/${pixelKey}`), pixelData);
      console.log('Pixel placed successfully:', {
        key: pixelKey,
        data: pixelData,
        timestamp: new Date().toISOString()
      });

      // Set cooldown
      const cooldownEndsAt = Date.now() + DEFAULT_COOLDOWN;
      setCanvasState((prev) => ({
        ...prev,
        cooldown: {
          active: true,
          endsAt: cooldownEndsAt,
        },
      }));

      // Save cooldown to localStorage
      localStorage.setItem(
        'pixelCooldown',
        JSON.stringify({ endsAt: cooldownEndsAt })
      );
    } catch (error) {
      console.error('Error placing pixel:', error);
      setError('Failed to place pixel');
    }
  };

  return (
    <CanvasContext.Provider
      value={{
        canvasState,
        setSelectedColor,
        placePixel,
        canPlacePixel,
        timeUntilNextPixel: () => remainingTime,
        formattedTime: formatTime(remainingTime),
      }}
    >
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
          {error}
        </div>
      )}
      {children}
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

export { CANVAS_SIZE, DEFAULT_COLORS }; 