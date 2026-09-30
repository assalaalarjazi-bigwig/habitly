import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppearanceMode, ColorTheme } from '../types';
import { THEME_PALETTES, ThemePalette } from './themeConfig';
import { storageService } from '../storage/storageService';

interface ThemeContextType {
  appearance: AppearanceMode;
  isDark: boolean;
  colorTheme: ColorTheme;
  palette: ThemePalette;
  setAppearance: (mode: AppearanceMode) => void;
  setColorTheme: (theme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appearance, setAppearanceState] = useState<AppearanceMode>(() => {
    return storageService.getSettings().appearance || 'system';
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    return storageService.getSettings().colorTheme || 'default';
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const isDark = appearance === 'system' ? systemIsDark : appearance === 'dark';
  const palette = THEME_PALETTES[colorTheme] || THEME_PALETTES.default;

  const setAppearance = (mode: AppearanceMode) => {
    setAppearanceState(mode);
    const settings = storageService.getSettings();
    storageService.saveSettings({ ...settings, appearance: mode });
  };

  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme);
    const settings = storageService.getSettings();
    storageService.saveSettings({ ...settings, colorTheme: theme });
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      // Apply dynamic CSS variables for app-wide theme permeation
      root.style.setProperty('--primary', palette.primary);
      root.style.setProperty('--primary-hover', palette.primaryHover);
      root.style.setProperty('--primary-bg', isDark ? palette.primaryBgDark : palette.primaryBg);
      root.style.setProperty('--primary-border', isDark ? `${palette.primary}40` : palette.borderAccent);
      root.style.setProperty('--primary-text', isDark ? '#ffffff' : palette.chipText);
      root.style.setProperty('--primary-ring', `${palette.primary}55`);
    }
  }, [isDark, palette]);

  return (
    <ThemeContext.Provider
      value={{
        appearance,
        isDark,
        colorTheme,
        palette,
        setAppearance,
        setColorTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
