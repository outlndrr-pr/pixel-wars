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
  
  // State to track if component has mounted
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState<{ x: number, y: number } | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isColorBombMode, setIsColorBombMode] = useState(false);
  const [isTerritoryShieldMode, setIsTerritoryShieldMode] = useState(false);
  
  // Reference to store the last mouse position during panning
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);

  // Track touch events
  const [touchStartPos, setTouchStartPos] = useState<{ x: number, y: number } | null>(null);
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);

  // Set mounted state after component mounts to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Draw the canvas
  useEffect(() => {
    // Don't render until client-side
    if (!isMounted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height, pixels } = canvasState;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply zoom and pan transformations
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(zoom, zoom);
    
    // Draw grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    
    for (let x = 0; x <= width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * pixelSize, 0);
      ctx.lineTo(x * pixelSize, height * pixelSize);
      ctx.stroke();
    }
    
    for (let y = 0; y <= height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * pixelSize);
      ctx.lineTo(width * pixelSize, y * pixelSize);
      ctx.stroke();
    }
    
    // Check active events
    const goldRushActive = events.find(e => e.type === 'goldRush' && e.active);
    const territoryWarsActive = events.find(e => e.type === 'territoryWars' && e.active);
    
    // Draw territory wars highlighted areas first
    if (territoryWarsActive && territoryWarsActive.affectedAreas) {
      ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
      territoryWarsActive.affectedAreas.forEach(area => {
        ctx.fillRect(
          area.x * pixelSize,
          area.y * pixelSize,
          area.width * pixelSize,
          area.height * pixelSize
        );
        
        // Draw border around the area
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          area.x * pixelSize,
          area.y * pixelSize,
          area.width * pixelSize,
          area.height * pixelSize
        );
      });
    }
    
    // Draw pixels
    Object.values(pixels).forEach(pixel => {
      // Set color based on pixel and events
      let pixelColor = pixel.color;
      
      // For gold rush event, add gold effect to pixels
      if (goldRushActive) {
        // Apply a gold overlay to pixels placed during the event
        if (goldRushActive.startTime && pixel.lastUpdated >= goldRushActive.startTime) {
          // Create a gold-tinted version of the pixel color
          const r = parseInt(pixel.color.slice(1, 3), 16);
          const g = parseInt(pixel.color.slice(3, 5), 16);
          const b = parseInt(pixel.color.slice(5, 7), 16);
          
          // Adjust to be more golden
          const goldR = Math.min(255, r + 40);
          const goldG = Math.min(255, g + 20);
          const goldB = Math.max(0, b - 30);
          
          pixelColor = `#${goldR.toString(16).padStart(2, '0')}${goldG.toString(16).padStart(2, '0')}${goldB.toString(16).padStart(2, '0')}`;
        }
      }
      
      ctx.fillStyle = pixelColor;
      ctx.fillRect(
        pixel.x * pixelSize, 
        pixel.y * pixelSize, 
        pixelSize, 
        pixelSize
      );
    });
    
    // Draw active territory shields
    const shields = activePowerUps.filter(p => 
      p.type === 'territoryShield' && 
      p.startTime && 
      p.endTime && 
      p.endTime > Date.now() &&
      p.affectedArea
    );
    
    shields.forEach(shield => {
      if (!shield.affectedArea) return;
      
      // Draw shield effect
      const teamColor = shield.teamId === 'red' ? '#FF5555' :
                       shield.teamId === 'blue' ? '#5555FF' :
                       shield.teamId === 'green' ? '#55AA55' :
                       shield.teamId === 'yellow' ? '#FFFF55' : '#FFFFFF';
      
      ctx.strokeStyle = teamColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      ctx.strokeRect(
        shield.affectedArea.x * pixelSize,
        shield.affectedArea.y * pixelSize,
        shield.affectedArea.width * pixelSize,
        shield.affectedArea.height * pixelSize
      );
      ctx.setLineDash([]);
      
      // Draw shield fill
      ctx.fillStyle = `${teamColor}30`; // 30 is hex for low opacity
      ctx.fillRect(
        shield.affectedArea.x * pixelSize,
        shield.affectedArea.y * pixelSize,
        shield.affectedArea.width * pixelSize,
        shield.affectedArea.height * pixelSize
      );
    });
    
    // Draw hover indicator if we have a position
    if (position && user.teamId && (canPlacePixel || (isColorBombMode && canUseColorBomb))) {
      if (isColorBombMode) {
        // Draw 2x2 color bomb preview
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          position.x * pixelSize,
          position.y * pixelSize,
          pixelSize * 2,
          pixelSize * 2
        );
        
        // Show semi-transparent preview of the pixels
        ctx.fillStyle = `${user.teamId === 'red' ? '#FF5555' :
                         user.teamId === 'blue' ? '#5555FF' :
                         user.teamId === 'green' ? '#55AA55' :
                         user.teamId === 'yellow' ? '#FFFF55' : '#FFFFFF'}50`;
        ctx.fillRect(
          position.x * pixelSize,
          position.y * pixelSize,
          pixelSize * 2,
          pixelSize * 2
        );
      } else {
        // Normal pixel placement preview
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          position.x * pixelSize,
          position.y * pixelSize,
          pixelSize,
          pixelSize
        );
      }
    }
    
    ctx.restore();
  }, [canvasState, position, pixelSize, user.teamId, canPlacePixel, panOffset, zoom, events, activePowerUps, isColorBombMode, canUseColorBomb, isMounted]);

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) return;
    if (!user.teamId) return;
    
    // Don't process clicks until component is mounted
    if (!isMounted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Calculate the position considering zoom and pan
    const x = Math.floor(((e.clientX - rect.left) * scaleX - panOffset.x) / (pixelSize * zoom));
    const y = Math.floor(((e.clientY - rect.top) * scaleY - panOffset.y) / (pixelSize * zoom));
    
    // Only place if within bounds
    if (x >= 0 && x < canvasState.width && y >= 0 && y < canvasState.height) {
      if (isColorBombMode && canUseColorBomb) {
        // Make sure we don't go out of bounds with the 2x2 pattern
        if (x + 1 < canvasState.width && y + 1 < canvasState.height) {
          try {
            useColorBomb(x, y);
            setIsColorBombMode(false);
          } catch (error) {
            console.error("Error using color bomb:", error);
          }
        }
      } else if (isTerritoryShieldMode && canUseTerritoryShield) {
        // Make sure we don't go out of bounds with the 5x5 pattern
        if (x + 4 < canvasState.width && y + 4 < canvasState.height) {
          try {
            useTerritoryShield(x, y);
            setIsTerritoryShieldMode(false);
          } catch (error) {
            console.error("Error using territory shield:", error);
          }
        }
      } else if (canPlacePixel) {
        // Check if the position is within a shielded area
        const shield = activePowerUps.find(p => 
          p.type === 'territoryShield' && 
          p.startTime && 
          p.endTime && 
          p.endTime > Date.now() &&
          p.affectedArea &&
          x >= p.affectedArea.x && 
          x < p.affectedArea.x + p.affectedArea.width &&
          y >= p.affectedArea.y && 
          y < p.affectedArea.y + p.affectedArea.height &&
          p.teamId !== user.teamId // Can't place if shield belongs to another team
        );
        
        // Only place if not shielded by another team
        if (!shield) {
          try {
            placePixel(x, y);
          } catch (error) {
            console.error("Error placing pixel:", error);
          }
        }
      }
    }
  };

  // Handle mouse movement for hover effect
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Calculate the position accounting for zoom and pan
    const x = Math.floor(((e.clientX - rect.left) * scaleX - panOffset.x) / (pixelSize * zoom));
    const y = Math.floor(((e.clientY - rect.top) * scaleY - panOffset.y) / (pixelSize * zoom));
    
    // If we're panning, update the pan offset
    if (isPanning && lastPositionRef.current) {
      const dx = (e.clientX - lastPositionRef.current.x) * scaleX;
      const dy = (e.clientY - lastPositionRef.current.y) * scaleY;
      
      setPanOffset(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
      
      lastPositionRef.current = { x: e.clientX, y: e.clientY };
    }
    
    // Update hover position if within bounds
    if (x >= 0 && x < canvasState.width && y >= 0 && y < canvasState.height) {
      setPosition({ x, y });
    } else {
      setPosition(null);
    }
  };

  // Start panning on middle mouse button press
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Middle mouse button (button 1) or right mouse button (button 2)
    if (e.button === 1 || e.button === 2) {
      e.preventDefault();
      setIsPanning(true);
      lastPositionRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  // Stop panning on mouse release
  const handleMouseUp = () => {
    setIsPanning(false);
    lastPositionRef.current = null;
  };

  // Handle zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Convert mouse position to canvas coordinates before zoom
    const canvasX = (mouseX * canvas.width / rect.width - panOffset.x) / zoom;
    const canvasY = (mouseY * canvas.height / rect.height - panOffset.y) / zoom;
    
    // Calculate new zoom level
    const delta = e.deltaY;
    const zoomFactor = 0.1;
    const newZoom = delta > 0 
      ? Math.max(0.5, zoom - zoomFactor) 
      : Math.min(5, zoom + zoomFactor);
    
    // Calculate new pan offset to keep the point under cursor fixed
    const newPanOffsetX = mouseX * canvas.width / rect.width - canvasX * newZoom;
    const newPanOffsetY = mouseY * canvas.height / rect.height - canvasY * newZoom;
    
    setZoom(newZoom);
    setPanOffset({ x: newPanOffsetX, y: newPanOffsetY });
  };

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      // Single touch for positioning/clicking
      setTouchStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      // Two fingers for pinch zoom
      const dist = getTouchDistance(e.touches);
      setLastTouchDistance(dist);
      
      // Also start panning with two fingers
      setIsPanning(true);
      setTouchStartPos({ 
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2, 
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2 
      });
      lastPositionRef.current = { 
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2, 
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2 
      };
    }
  };
  
  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    e.preventDefault(); // Prevent scrolling
    
    if (e.touches.length === 2 && lastTouchDistance !== null) {
      // Handle pinch zoom
      const newDist = getTouchDistance(e.touches);
      const delta = newDist - lastTouchDistance;
      
      // Apply zoom
      const zoomFactor = 0.01;
      const newZoom = delta > 0 
        ? Math.min(5, zoom + (delta * zoomFactor))
        : Math.max(0.5, zoom + (delta * zoomFactor));
      
      setZoom(newZoom);
      setLastTouchDistance(newDist);
      
      // Handle two-finger pan
      if (isPanning && lastPositionRef.current) {
        const touchCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const touchCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const dx = (touchCenterX - lastPositionRef.current.x) * scaleX;
        const dy = (touchCenterY - lastPositionRef.current.y) * scaleY;
        
        setPanOffset(prev => ({
          x: prev.x + dx,
          y: prev.y + dy
        }));
        
        lastPositionRef.current = { x: touchCenterX, y: touchCenterY };
      }
    } else if (e.touches.length === 1 && touchStartPos) {
      // Single touch - handle pan if movement is significant
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      
      // Check if this is a drag (pan) or just a small movement before tap
      const dx = touchX - touchStartPos.x;
      const dy = touchY - touchStartPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 10) { // threshold to differentiate between tap and pan
        setIsPanning(true);
        
        if (lastPositionRef.current) {
          const rect = canvas.getBoundingClientRect();
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;
          
          const dx = (touchX - lastPositionRef.current.x) * scaleX;
          const dy = (touchY - lastPositionRef.current.y) * scaleY;
          
          setPanOffset(prev => ({
            x: prev.x + dx,
            y: prev.y + dy
          }));
        }
        
        lastPositionRef.current = { x: touchX, y: touchY };
      } else {
        // Update hover position for visual feedback
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const x = Math.floor(((touchX - rect.left) * scaleX - panOffset.x) / (pixelSize * zoom));
        const y = Math.floor(((touchY - rect.top) * scaleY - panOffset.y) / (pixelSize * zoom));
        
        if (x >= 0 && x < canvasState.width && y >= 0 && y < canvasState.height) {
          setPosition({ x, y });
        } else {
          setPosition(null);
        }
      }
    }
  };
  
  // Handle touch end
  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Don't process touches until component is mounted
    if (!isMounted) return;
    
    if (e.touches.length === 0 && touchStartPos && !isPanning) {
      // It was a tap, place a pixel
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      const x = Math.floor(((touchStartPos.x - rect.left) * scaleX - panOffset.x) / (pixelSize * zoom));
      const y = Math.floor(((touchStartPos.y - rect.top) * scaleY - panOffset.y) / (pixelSize * zoom));
      
      if (x >= 0 && x < canvasState.width && y >= 0 && y < canvasState.height) {
        if (isColorBombMode && canUseColorBomb) {
          // Make sure we don't go out of bounds with the 2x2 pattern
          if (x + 1 < canvasState.width && y + 1 < canvasState.height) {
            try {
              useColorBomb(x, y);
              setIsColorBombMode(false);
            } catch (error) {
              console.error("Error using color bomb:", error);
            }
          }
        } else if (isTerritoryShieldMode && canUseTerritoryShield) {
          // Make sure we don't go out of bounds with the 5x5 pattern
          if (x + 4 < canvasState.width && y + 4 < canvasState.height) {
            try {
              useTerritoryShield(x, y);
              setIsTerritoryShieldMode(false);
            } catch (error) {
              console.error("Error using territory shield:", error);
            }
          }
        } else if (canPlacePixel) {
          // Check if the position is within a shielded area
          const shield = activePowerUps.find(p => 
            p.type === 'territoryShield' && 
            p.startTime && 
            p.endTime && 
            p.endTime > Date.now() &&
            p.affectedArea &&
            x >= p.affectedArea.x && 
            x < p.affectedArea.x + p.affectedArea.width &&
            y >= p.affectedArea.y && 
            y < p.affectedArea.y + p.affectedArea.height &&
            p.teamId !== user.teamId // Can't place if shield belongs to another team
          );
          
          // Only place if not shielded by another team
          if (!shield) {
            try {
              placePixel(x, y);
            } catch (error) {
              console.error("Error placing pixel:", error);
            }
          }
        }
      }
    }
    
    // Reset touch state
    setTouchStartPos(null);
    setLastTouchDistance(null);
    setIsPanning(false);
    lastPositionRef.current = null;
  };
  
  // Helper function to calculate distance between two touch points
  const getTouchDistance = (touches: React.TouchList): number => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  // Toggle color bomb mode
  const toggleColorBombMode = () => {
    if (canUseColorBomb) {
      setIsColorBombMode(!isColorBombMode);
      setIsTerritoryShieldMode(false);
    }
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
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
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