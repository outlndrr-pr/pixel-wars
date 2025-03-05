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
        <header className="sticky top-0 z-10 backdrop-blur-sm bg-white/80 dark:bg-black/80 border-b border-[var(--color-border)]">
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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main canvas area - takes up more space */}
              <div className="lg:col-span-2 space-y-6">
                <Card title="Canvas" subtitle="Place pixels to claim territory for your team" className="animate-fade-in">
                  <div className="aspect-square w-full overflow-hidden rounded-lg border border-[var(--color-border)]">
                    <PixelCanvas />
                  </div>
                </Card>
              </div>
              
              {/* Sidebar - right side components */}
              <div className="lg:col-span-2 space-y-6">
                {/* Team selector at the top */}
                <TeamSelector />
                
                {/* Two column layout for Color Palette and Team Progress */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ColorPicker />
                  <StatusBar />
                </div>
                
                {/* Two column layout for Events and Achievements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card title="Events" className="animate-fade-in">
                    <div className="space-y-3 text-sm">
                      <p className="text-[var(--color-text-primary)]">
                        Special events occur regularly on the canvas.
                      </p>
                      <p className="text-[var(--color-text-primary)]">
                        Participate in events to earn bonuses for your team!
                      </p>
                    </div>
                  </Card>
                  
                  <Card title="Achievements" className="animate-fade-in">
                    <div className="space-y-3 text-sm">
                      <p className="text-[var(--color-text-primary)]">
                        Complete achievements to showcase your skills.
                      </p>
                      <p className="text-[var(--color-text-primary)]">
                        Click the Achievements button to view all available challenges.
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}
          
          {/* About section at the bottom */}
          {!showAchievements && (
            <div className="mt-6">
              <Card title="About" className="animate-fade-in">
                <div className="space-y-3 text-sm">
                  <p className="text-[var(--color-text-primary)]">
                    Pixel War is a collaborative canvas where teams compete for territory by placing colored pixels.
                  </p>
                  <p className="text-[var(--color-text-primary)]">
                    Join a team, wait for your cooldown timer, and place pixels to help your team dominate the canvas!
                  </p>
                  <div className="pt-2 text-xs text-[var(--color-text-tertiary)]">
                    Inspired by Reddit's r/Place experiment
                  </div>
                </div>
              </Card>
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
