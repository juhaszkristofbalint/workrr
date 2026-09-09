"use client";

import { isTheme, THEME_COOKIE, type Theme } from "@/lib/theme";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function persistTheme(theme: Theme) {
  localStorage.setItem(THEME_COOKIE, theme);
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; samesite=lax`;
}

function readStoredTheme(): Theme | null {
  const stored = localStorage.getItem(THEME_COOKIE);
  return isTheme(stored) ? stored : null;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  useEffect(() => {
    const stored = readStoredTheme();
    const next = stored ?? initialTheme;
    setThemeState(next);
    persistTheme(next);
    applyTheme(next);
  }, [initialTheme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    persistTheme(next);
    applyTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
