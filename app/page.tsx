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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <PixelWarProvider>
      <div className="flex flex-col min-h-screen">
        {/* Modern header with glass effect */}
        <header className="sticky top-0 z-10 backdrop-blur-sm bg-white/70 dark:bg-black/70 border-b border-[var(--border)]">
          <div className="container mx-auto px-4 h-[var(--header-height)] flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">P</div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Pixel War</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Team-based pixel canvas</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowAchievements(prev => !prev)}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <span>{showAchievements ? '🎮' : '🏆'}</span>
              <span>{showAchievements ? 'Back to Game' : 'Achievements'}</span>
            </button>
          </div>
        </header>
        
        <main className="flex-grow container mx-auto px-4 py-8">
          {showAchievements ? (
            <div className="card p-6 animate-fade-in">
              <AchievementsPanel />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main canvas area - takes up more space */}
              <div className="lg:col-span-3 space-y-6">
                <div className="card p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Canvas</h2>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                      Live
                    </div>
                  </div>
                  <div className="aspect-square w-full overflow-hidden rounded-lg border border-[var(--border)]">
                    <PixelCanvas />
                  </div>
                </div>
                
                <StatusBar />
              </div>
              
              {/* Sidebar - more compact */}
              <div className="space-y-6">
                <TeamSelector />
                <ColorPicker />
                
                <div className="card p-6">
                  <h2 className="text-xl font-bold mb-4">About</h2>
                  <div className="space-y-3 text-sm">
                    <p className="text-gray-700 dark:text-gray-300">
                      Pixel War is a collaborative canvas where teams compete for territory by placing colored pixels.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      Join a team, wait for your cooldown timer, and place pixels to help your team dominate the canvas!
                    </p>
                    <div className="pt-2 text-xs text-gray-500 dark:text-gray-400">
                      Inspired by Reddit's r/Place experiment
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        
        <footer className="border-t border-[var(--border)] py-6 mt-auto">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Pixel War
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  Terms
                </a>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  Privacy
                </a>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
        
        {/* Achievement notifications */}
        <AchievementNotification />
      </div>
    </PixelWarProvider>
  );
}
