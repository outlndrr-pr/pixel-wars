'use client';

import { useState, useEffect } from 'react';
import { PixelWarProvider } from './contexts/PixelWarContext';
import { PixelCanvas } from './components/PixelCanvas';
import { ColorPicker } from './components/ColorPicker';
import { TeamSelector } from './components/TeamSelector';
import { StatusBar } from './components/StatusBar';
import { AchievementsPanel } from './components/AchievementsPanel';
import { AchievementNotification } from './components/AchievementNotification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [showAchievements, setShowAchievements] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-3xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <PixelWarProvider>
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="container mx-auto">
          <header className="flex items-center justify-between mb-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Pixel Wars
            </h1>
            <Button 
              onClick={() => setShowAchievements(!showAchievements)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {showAchievements ? "Back to Game" : "Achievements"}
            </Button>
          </header>

          {showAchievements ? (
            <div className="bg-slate-900 rounded-lg p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Your Achievements</h2>
              <AchievementsPanel />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900 rounded-lg p-6 shadow-xl">
                <h2 className="text-2xl font-bold mb-6">Canvas</h2>
                <PixelCanvas />
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-900 rounded-lg p-6 shadow-xl">
                  <h2 className="text-xl font-bold mb-4">Team Selection</h2>
                  <TeamSelector />
                </div>
                
                <div className="bg-slate-900 rounded-lg p-6 shadow-xl">
                  <h2 className="text-xl font-bold mb-4">Color Palette</h2>
                  <ColorPicker />
                </div>
                
                <div className="bg-slate-900 rounded-lg p-6 shadow-xl">
                  <h2 className="text-xl font-bold mb-4">Team Progress</h2>
                  <StatusBar />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PixelWarProvider>
  );
}
