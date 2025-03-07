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
import { cn } from '@/lib/utils';

export default function Home() {
  const [showAchievements, setShowAchievements] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if dark mode was previously preferred
    const savedTheme = localStorage.getItem('pixelWarsTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pixelWarsTheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pixelWarsTheme', 'light');
    }
  };

  if (!isMounted) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-3xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <PixelWarProvider>
      <div className={cn(
        "min-h-screen p-4 md:p-6 lg:p-8",
        isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'
      )}>
        <div className="container mx-auto max-w-7xl">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">P</div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Pixel Wars</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={toggleTheme}
                className={cn(
                  "p-2 rounded-full border shadow-sm transition-all",
                  isDarkMode 
                    ? "bg-slate-800 text-white border-slate-700 hover:bg-slate-700" 
                    : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
                )}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              
              <button 
                onClick={() => setShowAchievements(!showAchievements)}
                className={cn(
                  "px-4 py-2 rounded-full border shadow-sm transition-all",
                  isDarkMode 
                    ? "bg-slate-800 text-white border-slate-700 hover:bg-slate-700" 
                    : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
                )}
              >
                {showAchievements ? "Back to Game" : "Achievements"}
              </button>
            </div>
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
