import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

// Global theme state to ensure consistency across components
let globalTheme: Theme = 'light';
let globalThemeListeners: Array<(theme: Theme) => void> = [];

const notifyThemeListeners = (newTheme: Theme) => {
  globalTheme = newTheme;
  globalThemeListeners.forEach(listener => listener(newTheme));
};

// Initialize global theme from localStorage on module load
const initializeGlobalTheme = () => {
  const savedTheme = localStorage.getItem('theme') as Theme;
  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
    globalTheme = savedTheme;
  } else {
    // Check system preference if no saved theme
    try {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      globalTheme = prefersDark ? 'dark' : 'light';
    } catch (error) {
      globalTheme = 'light';
    }
  }
};

// Initialize theme immediately
initializeGlobalTheme();

export const useTheme = () => {
  // Check if theme is already applied to document and use that as initial state
  const getInitialTheme = (): Theme => {
    const root = window.document.documentElement;
    if (root.classList.contains('dark')) {
      return 'dark';
    } else if (root.classList.contains('light')) {
      return 'light';
    }
    return globalTheme;
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Listen for theme changes from other components
  useEffect(() => {
    const listener = (newTheme: Theme) => {
      setTheme(newTheme);
    };
    globalThemeListeners.push(listener);
    
    return () => {
      globalThemeListeners = globalThemeListeners.filter(l => l !== listener);
    };
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
    notifyThemeListeners(theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!window.matchMedia) {
      return;
    }
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        notifyThemeListeners(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    notifyThemeListeners(newTheme);
  };

  return { theme, toggleTheme, setTheme };
}; 