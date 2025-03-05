'use client';

import { useState, useEffect } from 'react';
import { PixelWarProvider } from './contexts/PixelWarContext';
import { PixelCanvas } from './components/PixelCanvas';
import { ColorPicker } from './components/ColorPicker';
import { TeamSelector } from './components/TeamSelector';
import { StatusBar } from './components/StatusBar';
import { AchievementsPanel } from './components/AchievementsPanel';
import { AchievementNotification } from './components/AchievementNotification';
import { Button, Card } from './components/ui';

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
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-[var(--color-border)] rounded-full mb-4"></div>
          <div className="h-4 w-64 bg-[var(--color-border)] rounded-full"></div>
        </div>
      </div>
    );
  }
  
  return (
    <PixelWarProvider>
      <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
        {/* Header with title */}
        <header className="sticky top-0 z-10 backdrop-blur-sm bg-black/80 border-b border-[var(--color-border)]">
          <div className="container mx-auto px-4 h-16 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-amber-500 flex items-center justify-center text-white font-bold">P</div>
              <h1 className="text-xl font-semibold tracking-tight">Pixel Wars</h1>
            </div>
            
            <Button
              variant={showAchievements ? 'secondary' : 'accent'}
              onClick={() => setShowAchievements(prev => !prev)}
              leftIcon={showAchievements ? '🎮' : '🏆'}
            >
              {showAchievements ? 'Back to Game' : 'Achievements'}
            </Button>
          </div>
        </header>
        
        <main className="flex-grow container mx-auto px-4 py-8">
          {showAchievements ? (
            <Card title="Your Achievements" className="animate-fade-in">
              <AchievementsPanel />
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Canvas Section */}
              <div className="lg:col-span-8 space-y-6">
                <div className="canvas-container">
                  <PixelCanvas />
                </div>
                
                <div className="card p-4">
                  <h2 className="text-lg font-semibold mb-3">Color Palette</h2>
                  <ColorPicker />
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="card p-6">
                  <h2 className="text-lg font-semibold mb-4">Choose Your Team</h2>
                  <TeamSelector />
                </div>

                <div className="card p-6">
                  <h2 className="text-lg font-semibold mb-4">Team Progress</h2>
                  <StatusBar />
                </div>

                <div className="card p-6">
                  <h2 className="text-lg font-semibold mb-4">Achievements</h2>
                  <AchievementsPanel />
                </div>

                <div className="card p-6">
                  <h2 className="text-lg font-semibold mb-4">About</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Pixel War is a collaborative pixel art platform where teams compete to create beautiful artwork together.
                    Choose your team, select your colors, and contribute to the canvas!
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
        
        <footer className="border-t border-[var(--color-border)] py-6 mt-auto">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-[var(--color-text-tertiary)]">
                &copy; {new Date().getFullYear()} Pixel War
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]">
                  Terms
                </a>
                <a href="#" className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]">
                  Privacy
                </a>
                <a href="#" className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]">
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
