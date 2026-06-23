'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/stores/useSettingsStore';

const COLOR_MAP: Record<string, string> = {
  emerald: '#10b981',
  cyan: '#22d3ee',
  violet: '#a78bfa',
  amber: '#fbbf24',
  rose: '#fb7185',
  blue: '#60a5fa',
  purple: '#c084fc',
  pink: '#f472b6',
  orange: '#fb923c',
  teal: '#2dd4bf',
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, accentColor, glassIntensity } = useSettingsStore();

  useEffect(() => {
    const d = document.documentElement;
    const hex = COLOR_MAP[accentColor] || accentColor || '#10b981';
    
    // Apply accent color
    d.style.setProperty('--accent-color', hex);
    
    // Calculate RGB from hex
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    d.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
    d.style.setProperty('--accent-color-name', accentColor);
    d.style.setProperty('--bg-blur', `${glassIntensity}px`);

    // Apply theme class
    if (theme === 'light') {
      d.classList.add('light');
    } else {
      d.classList.remove('light');
    }
  }, [theme, accentColor, glassIntensity]);

  return <>{children}</>;
}