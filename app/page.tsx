'use client';

import { useState, useEffect } from 'react';
import { PixelWarProvider } from './contexts/PixelWarContext';
import { PixelCanvas } from './components/PixelCanvas';
import { ColorPicker } from './components/ColorPicker';
import { TeamSelector } from './components/TeamSelector';
import { StatusBar } from './components/StatusBar';
import { AchievementsPanel } from './components/AchievementsPanel';
import { AchievementNotification } from './components/AchievementNotification';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card';

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
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-6 lg:p-8">
        <div className="container mx-auto max-w-7xl">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">P</div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Pixel Wars</h1>
            </div>
            
            <button 
              onClick={() => setShowAchievements(!showAchievements)}
              className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 text-gray-800 dark:text-white border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 shadow-sm transition-all"
            >
              {showAchievements ? "Back to Game" : "Achievements"}
            </button>
          </header>

          {showAchievements ? (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <AchievementsPanel />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Canvas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PixelCanvas />
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Selection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TeamSelector />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Color Palette</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ColorPicker />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Team Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <StatusBar />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
        
        <AchievementNotification />
      </div>
    </PixelWarProvider>
  );
}
