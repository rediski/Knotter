'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const isDark = theme === 'dark';
    const isSystem = theme === 'system';

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="p-2 rounded-md bg-depth-2 border border-depth-3 h-8 w-8" />;
    }

    const nextTheme = (): Theme => {
        if (theme === 'light') return 'dark';
        if (theme === 'dark') return 'system';
        return 'light';
    };

    return (
        <button
            onClick={() => setTheme(nextTheme())}
            className="p-2 rounded-md bg-depth-2 hover:bg-depth-3 border border-depth-3 h-8 w-8 cursor-pointer flex items-center justify-center"
        >
            {isSystem ? <Monitor size={16} /> : isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
    );
}
