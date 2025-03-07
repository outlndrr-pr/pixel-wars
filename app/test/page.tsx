'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { cn } from '@/lib/utils';

export default function TestPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMounted, setIsMounted] = useState(false);
  
  // Use useEffect to handle client-side theme setting
  useEffect(() => {
    setIsMounted(true);
    // Set initial theme based on localStorage or system preference
    const savedTheme = localStorage.getItem('pixelWarsTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pixelWarsTheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pixelWarsTheme', 'light');
    }
  };
  
  // Don't render until client-side
  if (!isMounted) {
    return null;
  }
  
  return (
    <div className={cn(
      "min-h-screen p-8",
      theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'
    )}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">UI Test Page</h1>
          <button
            onClick={toggleTheme}
            className={cn(
              "px-4 py-2 rounded-full transition-colors",
              theme === 'dark' 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "bg-blue-500 text-white hover:bg-blue-600"
            )}
          >
            Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This is a basic card with just a title and content.</p>
            </CardContent>
          </Card>
          
          <Card title="Card with Props Title" subtitle="And a subtitle too">
            <CardContent>
              <p>This card uses the title and subtitle props instead of CardHeader/CardTitle components.</p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500 dark:text-gray-400">Card Footer</p>
            </CardFooter>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Styling Test Card</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
                Nested container with background
              </div>
              
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
                  Blue Tag
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">
                  Green Tag
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs">
                  Red Tag
                </span>
              </div>
              
              <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
              </div>
              
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                Test Button
              </button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          This is a test page to verify UI styling. Current theme: {theme}
        </div>
      </div>
    </div>
  );
} 