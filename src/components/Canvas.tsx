import React, { useState, useRef, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import RetroWindow from './RetroWindow';
import { useCanvas, CANVAS_SIZE } from '@/context/CanvasContext';

type CanvasProps = {
  className?: string;
};

const Canvas: React.FC<CanvasProps> = ({ className = '' }) => {
  const { canvasState, placePixel, canPlacePixel } = useCanvas();
  const [hoveredCoords, setHoveredCoords] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(1);

  // Fixed pixel size
  const pixelSize = 8;
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = CANVAS_SIZE / rect.width;
      const scaleY = CANVAS_SIZE / rect.height;
      
      const x = Math.floor((e.clientX - rect.left) * scaleX);
      const y = Math.floor((e.clientY - rect.top) * scaleY);
      
      if (x >= 0 && x < CANVAS_SIZE && y >= 0 && y < CANVAS_SIZE) {
        setHoveredCoords({ x, y });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const renderPixels = () => {
    const pixels = [];
    for (let y = 0; y < CANVAS_SIZE; y++) {
      for (let x = 0; x < CANVAS_SIZE; x++) {
        const key = `${x}-${y}`;
        const pixelData = canvasState.pixels[key];
        const isCheckerboard = (x + y) % 2 === 0;
        const isHovered = hoveredCoords.x === x && hoveredCoords.y === y;
        
        pixels.push(
          <div
            key={key}
            className={`pixel ${isHovered ? 'hovered' : ''}`}
            style={{
              backgroundColor: pixelData?.color || (isCheckerboard ? '#fff' : '#e4e4e4'),
              width: `1%`,
              height: `1%`,
              cursor: canPlacePixel() ? 'pointer' : 'not-allowed',
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
            }}
            onClick={() => placePixel(x, y)}
            data-x={x}
            data-y={y}
          />
        );
      }
    }
    return pixels;
  };

  return (
    <RetroWindow title="Canvas" className={className}>
      <div className="canvas-container">
        <TransformWrapper
          initialScale={1}
          minScale={1}
          maxScale={20}
          limitToBounds={true}
          centerOnInit={true}
          wheel={{ step: 0.2 }}
          pinch={{ step: 5 }}
          doubleClick={{ disabled: true }}
          alignmentAnimation={{ disabled: true }}
          velocityAnimation={{ disabled: true }}
          zoomAnimation={{ disabled: true }}
        >
          <TransformComponent
            wrapperStyle={{
              width: '100%',
              height: '100%',
              imageRendering: 'pixelated'
            }}
            contentStyle={{
              width: '100%',
              height: '100%',
              imageRendering: 'pixelated'
            }}
          >
            <div 
              ref={canvasRef} 
              className="pixel-grid"
              style={{
                imageRendering: 'pixelated'
              }}
            >
              {!canvasState.loading ? renderPixels() : <div className="loading">Loading...</div>}
            </div>
          </TransformComponent>
        </TransformWrapper>
        <div className="coordinates">
          ({hoveredCoords.x}, {hoveredCoords.y})
        </div>
      </div>

      <style jsx global>{`
        /* Base styles - mobile first */
        .canvas-container {
          width: calc(100vw - 80px);
          max-width: 600px;
          aspect-ratio: 1;
          margin: 0 auto;
          position: relative;
          border: 2px solid #000;
          border-radius: 4px;
          overflow: hidden;
          background: transparent;
          padding: 8px;
          box-sizing: content-box;
          display: flex;
          align-items: center;
          justify-content: center;
          image-rendering: pixelated;
        }

        .pixel-grid {
          width: 94%;
          height: 94%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 1px solid #ddd;
          box-sizing: border-box;
          background: transparent;
          image-rendering: pixelated;
        }

        .pixel {
          box-sizing: border-box;
          transition: transform 0.1s ease;
          image-rendering: pixelated;
        }

        .pixel.hovered {
          z-index: 10;
          outline: 1px solid black;
          transform: scale(1.1);
        }

        .coordinates {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #000;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          pointer-events: none;
          z-index: 100;
        }

        /* Desktop styles - kept completely separate */
        @media (min-width: 768px) {
          .canvas-container {
            width: 70vh;
            max-width: 700px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            padding: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .pixel-grid {
            width: 94%;
            height: 94%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            margin: 0;
            border: 1px solid #ccc;
          }

          /* Ensure TransformComponent is centered */
          .react-transform-component {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .react-transform-wrapper {
            width: 100% !important;
            height: 100% !important;
          }

          .coordinates {
            font-size: 14px;
            padding: 6px 10px;
            bottom: 16px;
            background: rgba(255, 255, 255, 0.95);
          }

          .pixel:hover {
            z-index: 10;
            transform: scale(1.1);
          }
        }
      `}</style>
    </RetroWindow>
  );
};

export default Canvas; 