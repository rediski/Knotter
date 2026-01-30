'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
    label?: string;
    className?: string;
}

export function ThemeToggle({ label, className }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();

    const isDark = theme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`
                p-2 rounded-md bg-depth-2 hover:bg-depth-3 cursor-pointer flex items-center 
                 ${className ?? ''}
            `}
            aria-label="Toggle theme"
        >
            {label && <span className="mr-2">{label}</span>}

            {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
    );
}
