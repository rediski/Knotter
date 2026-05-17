'use client';

import { memo } from 'react';

interface ColorPickerProps {
    color: string;
    onColorChange: (color: string) => void;
}

const PRESET_COLORS = [
    '#171717',
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
    '#ededed',
];

export const ColorPicker = memo(function ColorPicker({ color, onColorChange }: ColorPickerProps) {
    const safeColor = color ?? 'var(--foreground)';

    return (
        <div className="flex gap-2 items-center">
            <div className="flex items-center flex-wrap gap-2">
                {PRESET_COLORS.map((presetColor) => (
                    <button
                        key={presetColor}
                        onClick={() => onColorChange(presetColor)}
                        className={`
                            w-8 h-8 rounded-md cursor-pointer border transition-all duration-100
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
