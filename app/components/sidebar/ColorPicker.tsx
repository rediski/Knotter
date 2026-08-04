'use client';

import { memo } from 'react';
import { X } from 'lucide-react';

interface ColorPickerProps {
    color: string | null;
    onColorChange: (color: string | null) => void;
}

const PRESET_COLORS = [
    '#846358',
    '#0c8599',
    '#1971c2',
    '#6741d9',
    '#9c36b5',
    '#c2255c',
    '#2f9e44',
    '#099268',
    '#f08c00',
    '#e8590c',
    '#e03131',
];

export const ColorPicker = memo(function ColorPicker({ color, onColorChange }: ColorPickerProps) {
    const safeColor = color ?? 'var(--foreground)';
    const hasColor = color !== null;

    return (
        <div className="flex gap-2 items-center flex-wrap">
            <button
                onClick={() => onColorChange(null)}
                className={`
                    flex items-center justify-center bg-transparent border-depth-3 w-8 h-8 rounded-md cursor-pointer border transition-all duration-100 
                    ${!hasColor ? 'scale-110 border-2 border-foreground' : 'hover:scale-110'}
                `}
                title="По умолчанию"
            >
                <X size={16} className="text-foreground" />
            </button>

            {PRESET_COLORS.map((presetColor) => (
                <button
                    key={presetColor}
                    onClick={() => onColorChange(presetColor)}
                    className={`
                        w-8 h-8 rounded-md cursor-pointer border transition-all duration-100
                        ${safeColor === presetColor ? 'scale-110' : 'hover:scale-110'}
                    `}
                    style={{
                        backgroundColor: presetColor,
                        borderColor: safeColor === presetColor ? 'var(--foreground)' : presetColor,
                    }}
                    title={presetColor}
                />
            ))}
        </div>
    );
});
