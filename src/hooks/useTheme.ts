import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

// Global theme state to ensure consistency across components
let globalTheme: Theme = 'light';
let globalThemeListeners: Array<(theme: Theme) => void> = [];

const notifyThemeListeners = (newTheme: Theme) => {
  globalTheme = newTheme;
  globalThemeListeners.forEach(listener => listener(newTheme));
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(globalTheme);

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

  // Initialize theme based on browser preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    
    // Check if we're in a test environment or if matchMedia is not available
    let prefersDark = false;
    try {
      prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
      // In test environment or when matchMedia is not available, default to light
      prefersDark = false;
    }
    
    let initialTheme: Theme;
    if (savedTheme) {
      initialTheme = savedTheme;
    } else {
      initialTheme = prefersDark ? 'dark' : 'light';
    }
    
    if (globalTheme === 'light' && initialTheme !== 'light') {
      setTheme(initialTheme);
      notifyThemeListeners(initialTheme);
    }
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
    // Check if we're in a test environment or if matchMedia is not available
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