import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultPadTheme, PadTheme, padThemes } from '../lib/pad-themes';

interface PadThemeContextType {
  theme: PadTheme;
  setTheme: (theme: PadTheme) => void;
}

const PadThemeContext = createContext<PadThemeContextType | undefined>(undefined);

export function PadThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<PadTheme>(() => {
    const saved = localStorage.getItem('pad-theme');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const exists = padThemes.find(t => t.id === parsed.id);
        if (exists) return exists;
      } catch (e) {}
    }
    return defaultPadTheme;
  });

  const setTheme = (newTheme: PadTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('pad-theme', JSON.stringify(newTheme));
  };

  return (
    <PadThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </PadThemeContext.Provider>
  );
}

export function usePadTheme() {
  const context = useContext(PadThemeContext);
  if (context === undefined) {
    throw new Error('usePadTheme must be used within a PadThemeProvider');
  }
  return context;
}
