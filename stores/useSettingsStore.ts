'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'dark' | 'light' | 'system';

interface SettingsState {
  theme: Theme;
  accentColor: string;
  glassIntensity: number;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: string) => void;
  setGlassIntensity: (intensity: number) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS = {
  theme: 'dark' as Theme,
  accentColor: 'emerald',
  glassIntensity: 20,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: DEFAULT_SETTINGS.theme,
      accentColor: DEFAULT_SETTINGS.accentColor,
      glassIntensity: DEFAULT_SETTINGS.glassIntensity,
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setGlassIntensity: (glassIntensity) => set({ glassIntensity }),
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'cipher-talk-settings',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);

export const getThemeClass = (theme: Theme, systemPrefersDark: boolean): 'dark' | 'light' => {
  if (theme === 'system') {
    return systemPrefersDark ? 'dark' : 'light';
  }
  return theme;
};