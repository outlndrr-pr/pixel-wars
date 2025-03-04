'use client';

import { useState, useEffect } from 'react';
import { PixelWarProvider } from './contexts/PixelWarContext';
import { PixelCanvas } from './components/PixelCanvas';
import { ColorPicker } from './components/ColorPicker';
import { TeamSelector } from './components/TeamSelector';
import { StatusBar } from './components/StatusBar';
import { AchievementsPanel } from './components/AchievementsPanel';
import { AchievementNotification } from './components/AchievementNotification';

export default function Home() {
  const [showAchievements, setShowAchievements] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  
  // Set mounted state after component mounts to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    // Return a simple loading state or skeleton UI to prevent hydration errors
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl">Loading Pixel War...</p>
      </div>
    );
  }
  
  return (
    <PixelWarProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-center sm:text-left">Pixel War</h1>
                <p className="text-gray-600 text-center sm:text-left">A collaborative pixel-placing team battle</p>
              </div>
              
              <button
                onClick={() => setShowAchievements(prev => !prev)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
              >
                <span className="mr-2">{showAchievements ? '🎮' : '🏆'}</span>
                {showAchievements ? 'Back to Game' : 'Achievements'}
              </button>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          {showAchievements ? (
            <AchievementsPanel />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main canvas area */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4">Canvas</h2>
                  <div className="aspect-square w-full">
                    <PixelCanvas />
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Pan with middle or right mouse button, zoom with mouse wheel.
                  </p>
                </div>
                
                <StatusBar />
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                <TeamSelector />
                <ColorPicker />
                
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4">About Pixel War</h2>
                  <p className="text-gray-700 mb-2">
                    Pixel War is a collaborative canvas where teams compete for territory by placing colored pixels.
                  </p>
                  <p className="text-gray-700 mb-2">
                    Join a team, wait for your cooldown timer, and place pixels to help your team dominate the canvas!
                  </p>
                  <p className="text-gray-700">
                    This project is inspired by Reddit's r/Place experiment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
        
        <footer className="bg-white mt-8 py-6 border-t">
          <div className="container mx-auto px-4">
            <p className="text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Pixel War - Built with Next.js and React
            </p>
          </div>
        </footer>
        
        {/* Achievement notifications */}
        <AchievementNotification />
      </div>
    </PixelWarProvider>
  );
}
