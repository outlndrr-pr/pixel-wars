'use client';

import React, { useState, useEffect } from 'react';
import Canvas from '@/components/Canvas';
import ColorPicker from '@/components/ColorPicker';
import Stats from '@/components/Stats';
import LoadingScreen from '@/components/LoadingScreen';
import RetroDecorations from '@/components/RetroDecorations';
import DialogBox from '@/components/DialogBox';
import RetroWindow from '@/components/RetroWindow';
import RetroButton from '@/components/RetroButton';
import { useCanvas } from '@/context/CanvasContext';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { canvasState, setSelectedColor } = useCanvas();

  // Simulate initial loading
  useEffect(() => {
    // Show loading screen for a few seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* App header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Pixel Wars</h1>
          <RetroButton
            onClick={() => setIsDialogOpen(true)}
          >
            Help
          </RetroButton>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="md:col-span-2">
            <Canvas className="mb-6" />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            <ColorPicker
              selectedColor={canvasState.selectedColor}
              onColorSelect={setSelectedColor}
            />
            <Stats />

            {/* Info Window */}
            <RetroWindow title="How to Play">
              <div className="text-sm">
                <p className="mb-2">1. Select a color from the palette</p>
                <p className="mb-2">2. Click on the canvas to place a pixel</p>
                <p className="mb-4">3. Wait for the cooldown to end before placing another pixel</p>
                <p>Collaborate with others to create art!</p>
              </div>
            </RetroWindow>
          </div>
        </div>

        {/* Dialog */}
        <DialogBox
          isOpen={isDialogOpen}
          title="Welcome to Pixel Wars!"
          message="Place one pixel at a time and collaborate with others to create art. You'll need to wait for the cooldown to end before placing another pixel."
          onConfirm={() => setIsDialogOpen(false)}
          confirmText="Got it!"
        />

        {/* Decorative elements */}
        <RetroDecorations />
      </div>
    </main>
  );
}
