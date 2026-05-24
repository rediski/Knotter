'use client';

import { useState, useEffect, useContext, createContext, type ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

export const ThemeContext = createContext<{ theme: Theme; setTheme: (theme: Theme) => void }>({
    theme: 'system',
    setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('system');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = (localStorage.getItem('theme') as Theme) || 'system';

        setTheme(saved);
        setMounted(true);

        const root = document.documentElement;

        if (saved === 'system') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.setAttribute('data-theme', isDark ? 'dark' : 'light');
        }

        if (saved !== 'system') {
            root.setAttribute('data-theme', saved);
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        localStorage.setItem('theme', theme);

        const root = document.documentElement;

        if (theme === 'system') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.setAttribute('data-theme', isDark ? 'dark' : 'light');
        }

        if (theme !== 'system') {
            root.setAttribute('data-theme', theme);
        }
    }, [theme, mounted]);

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
