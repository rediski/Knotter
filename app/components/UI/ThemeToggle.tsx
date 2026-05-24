'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 rounded-md bg-depth-2 hover:bg-depth-3 border border-depth-3 h-8 w-8 cursor-pointer flex items-center"
        >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
    );
}
