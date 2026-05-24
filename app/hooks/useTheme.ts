import { useContext } from 'react';
import { ThemeContext } from '@/components/ThemeProvider';

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a Provider');
    }

    return context;
};
