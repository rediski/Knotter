'use client';

import { memo } from 'react';
import { Ban } from 'lucide-react';

interface ColorPickerProps {
    color: string;
    onColorChange: (color: string) => void;
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

    return (
        <div className="flex gap-2 items-center">
            <div className="flex items-center flex-wrap gap-2">
                <button
                    onClick={() => onColorChange('var(--foreground)')}
                    className={`
                            flex items-center justify-center w-8 h-8 rounded-md cursor-pointer border-2 border-dashed text-foreground bg-depth-3
                            ${safeColor === 'var(--foreground)' ? ' scale-110' : 'hover:scale-110'}
                        `}
                    style={{
                        borderColor: safeColor === 'var(--foreground)' ? 'var(--foreground)' : 'var(--depth-5)',
                    }}
                    title="Цвет по умолчанию"
                >
                    <Ban size={18} />
                </button>

                {PRESET_COLORS.map((presetColor) => (
                    <button
                        key={presetColor}
                        onClick={() => onColorChange(presetColor)}
                        className={`
                            w-8 h-8 rounded-md cursor-pointer border-2 border-dashed transition-all duration-200
                            ${safeColor === presetColor ? ' scale-110' : 'hover:scale-110'}
                        `}
                        style={{
                            backgroundColor: presetColor,
                            borderColor: safeColor === presetColor ? 'var(--foreground)' : presetColor,
                        }}
                        title={presetColor}
                    />
                ))}
            </div>
        </div>
    );
});
