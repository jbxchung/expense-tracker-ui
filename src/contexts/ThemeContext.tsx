import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from 'hooks/useLocalStorage';

export const Themes = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;
export type Theme = typeof Themes[keyof typeof Themes];

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: Themes.LIGHT,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useLocalStorage<Theme>(
    'user-theme',
    window.matchMedia('(prefers-color-scheme: dark)').matches ? Themes.DARK : Themes.LIGHT
  );

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === Themes.LIGHT ? Themes.DARK : Themes.LIGHT);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
