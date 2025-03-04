'use client';

import { useRef, useEffect, useState } from 'react';
import { usePixelWar } from '../contexts/PixelWarContext';

interface PixelCanvasProps {
  pixelSize?: number;
}

export function PixelCanvas({ pixelSize = 10 }: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    canvasState, 
    placePixel, 
    user, 
    canPlacePixel, 
    events, 
    activePowerUps,
    useColorBomb,
    canUseColorBomb,
    useTerritoryShield,
    canUseTerritoryShield
  } = usePixelWar();
  
  // Power-up mode states
  const [isColorBombMode, setIsColorBombMode] = useState(false);
  const [isTerritoryShieldMode, setIsTerritoryShieldMode] = useState(false);
  
  // Track component mount state to avoid state updates after unmount
  const [isMounted, setIsMounted] = useState(false);

  // Set up canvas when component mounts
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Draw pixels on canvas
  useEffect(() => {
    if (!canvasRef.current || !isMounted) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvasState.width * pixelSize;
    canvas.height = canvasState.height * pixelSize;
    
    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#EEEEEE';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= canvasState.width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * pixelSize, 0);
      ctx.lineTo(x * pixelSize, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= canvasState.height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * pixelSize);
      ctx.lineTo(canvas.width, y * pixelSize);
      ctx.stroke();
    }
    
    // Draw pixels
    Object.values(canvasState.pixels).forEach(pixel => {
      ctx.fillStyle = pixel.color;
      ctx.fillRect(
        pixel.x * pixelSize, 
        pixel.y * pixelSize, 
        pixelSize, 
        pixelSize
      );
    });
    
    // Draw power-up effects
    activePowerUps.forEach(powerUp => {
      // For color bomb, we need to add x and y properties for rendering
      if (powerUp.type === 'colorBomb' && powerUp.affectedArea) {
        // Draw color bomb effect
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.fillRect(
          powerUp.affectedArea.x * pixelSize,
          powerUp.affectedArea.y * pixelSize,
          pixelSize * 2,
          pixelSize * 2
        );
      } else if (powerUp.type === 'territoryShield' && powerUp.affectedArea) {
        // Draw territory shield effect
        ctx.fillStyle = 'rgba(0, 191, 255, 0.2)';
        ctx.fillRect(
          powerUp.affectedArea.x * pixelSize,
          powerUp.affectedArea.y * pixelSize,
          pixelSize * 5,
          pixelSize * 5
        );
        
        // Draw shield border
        ctx.strokeStyle = 'rgba(0, 191, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          powerUp.affectedArea.x * pixelSize,
          powerUp.affectedArea.y * pixelSize,
          pixelSize * 5,
          pixelSize * 5
        );
      }
    });
    
    // Highlight areas for territory wars event
    const territoryWarsEvent = events.find(e => e.type === 'territoryWars' && e.active);
    if (territoryWarsEvent && territoryWarsEvent.affectedAreas && territoryWarsEvent.affectedAreas.length > 0) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
      territoryWarsEvent.affectedAreas.forEach(area => {
        ctx.fillRect(
          area.x * pixelSize,
          area.y * pixelSize,
          area.width * pixelSize,
          area.height * pixelSize
        );
      });
    }
    
  }, [canvasState, pixelSize, activePowerUps, events, isMounted]);

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !user) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Calculate position based on click coordinates
    const x = Math.floor((e.clientX - rect.left) * scaleX / pixelSize);
    const y = Math.floor((e.clientY - rect.top) * scaleY / pixelSize);
    
    // Ensure coordinates are within bounds
    if (x < 0 || x >= canvasState.width || y < 0 || y >= canvasState.height) {
      return;
    }
    
    // Check if user can place a pixel
    if (!canPlacePixel) {
      console.log('Cannot place pixel - cooldown active or not in a team');
      return;
    }
    
    // Check if color bomb mode is active
    if (isColorBombMode && canUseColorBomb) {
      useColorBomb(x, y);
      setIsColorBombMode(false);
      return;
    }
    
    // Check if territory shield mode is active
    if (isTerritoryShieldMode && canUseTerritoryShield) {
      useTerritoryShield(x, y);
      setIsTerritoryShieldMode(false);
      return;
    }
    
    // Place a regular pixel
    placePixel(x, y);
  };

  // Toggle color bomb mode
  const toggleColorBombMode = () => {
    if (!user || !canUseColorBomb) {
      console.log('Cannot use Color Bomb - cooldown active or not in a team');
      return;
    }
    
    setIsColorBombMode(prev => !prev);
    setIsTerritoryShieldMode(false);
  };
  
  // Toggle territory shield mode
  const toggleTerritoryShieldMode = () => {
    if (canUseTerritoryShield) {
      setIsTerritoryShieldMode(!isTerritoryShieldMode);
      setIsColorBombMode(false);
    }
  };
  
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={canvasState.width * pixelSize}
        height={canvasState.height * pixelSize}
        onClick={handleCanvasClick}
        className="border border-gray-300 w-full h-full touch-none"
      />
      
      {user.teamId && (
        <div className="absolute bottom-4 right-4 space-x-2">
          {canUseColorBomb && (
            <button
              onClick={toggleColorBombMode}
              className={`p-2 rounded-full ${isColorBombMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              title="Color Bomb: Place a 2x2 block of pixels"
            >
              💣
            </button>
          )}
          
          {canUseTerritoryShield && (
            <button
              onClick={toggleTerritoryShieldMode}
              className={`p-2 rounded-full ${isTerritoryShieldMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              title="Territory Shield: Protect a 5x5 area for 1 minute"
            >
              🛡️
            </button>
          )}
        </div>
      )}
    </div>
  );
}