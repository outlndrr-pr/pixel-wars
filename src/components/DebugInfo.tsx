'use client';

import { useState, useEffect } from 'react';

export default function DebugInfo() {
  const [info, setInfo] = useState({
    windowWidth: 0,
    windowHeight: 0,
    isDarkMode: false,
    isClient: false,
    userAgent: '',
    loadTime: 0
  });

  useEffect(() => {
    const startTime = performance.now();
    
    setInfo({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      isClient: true,
      userAgent: navigator.userAgent,
      loadTime: Math.round(performance.now() - startTime)
    });

    const handleResize = () => {
      setInfo(prev => ({
        ...prev,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!info.isClient) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        padding: '10px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px'
      }}
    >
      <h4 style={{ margin: '0 0 5px 0' }}>Debug Info</h4>
      <p style={{ margin: '0 0 3px 0' }}>Window: {info.windowWidth}x{info.windowHeight}</p>
      <p style={{ margin: '0 0 3px 0' }}>Dark Mode: {info.isDarkMode ? 'Yes' : 'No'}</p>
      <p style={{ margin: '0 0 3px 0' }}>Load Time: {info.loadTime}ms</p>
      <p style={{ margin: '0 0 3px 0', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {info.userAgent}
      </p>
    </div>
  );
} 