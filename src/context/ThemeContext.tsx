import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  getAppThemeColors,
  type AppThemeColors,
} from '../theme/appTheme';

export type ThemeContextValue = {
  darkMode: boolean;
  toggleTheme: () => void;
  colors: AppThemeColors;
};

const ThemeContext =
  createContext<ThemeContextValue | null>(
    null
  );

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [darkMode, setDarkMode] =
    useState(true);

  function toggleTheme() {
    setDarkMode((prev) => !prev);
  }

  const colors =
    useMemo(
      () =>
        getAppThemeColors(darkMode),
      [darkMode]
    );

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {

  const ctx =
    useContext(ThemeContext);

  if (!ctx) {
    throw new Error(
      'useTheme must be used within ThemeProvider'
    );
  }

  return ctx;
}
