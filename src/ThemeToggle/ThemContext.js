import React, { createContext, useState, useContext } from "react";

// Create context
const ThemeContext = createContext();

// Create a provider component
export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for easier usage
export function useTheme() {
  return useContext(ThemeContext);
}
