import React, {
  createContext,
  useContext,
  useState,
} from 'react';

const ThemeContext =
  createContext<any>(null);

export function ThemeProvider({
  children,
}: any) {

  const [darkMode, setDarkMode] =
    useState(true);

  function toggleTheme() {
    setDarkMode(!darkMode);
  }

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}