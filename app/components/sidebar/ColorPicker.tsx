'use client';

import { memo } from 'react';
import { X } from 'lucide-react';

interface ColorPickerProps {
    color: string | null;
    onColorChange: (color: string | null) => void;
}

const PRESET_COLORS = [
    'rgb(132, 99, 88)',
    'rgb(12, 133, 153)',
    'rgb(25, 113, 194)',
    'rgb(103, 65, 217)',
    'rgb(156, 54, 181)',
    'rgb(194, 37, 92)',
    'rgb(47, 158, 68)',
    'rgb(9, 146, 104)',
    'rgb(240, 140, 0)',
    'rgb(232, 89, 12)',
    'rgb(224, 49, 49)',
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
