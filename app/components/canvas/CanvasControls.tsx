'use client';

import { useState, useEffect } from 'react';

import { Tooltip } from '@/components/UI/Tooltip';

import { useCanvasStore } from '@/store/useCanvasStore';

import { toggleMagnetMode } from '@/utils/canvas/toggleMagnetMode';
import { toggleTooltipMode } from '@/utils/canvas/toggleTooltipMode';
import { toggleInvertY } from '@/utils/canvas/toggleInvertY';

import { Magnet, Grid2x2, Move3d, Eye, EyeOff, EyeClosed, MoveVertical } from 'lucide-react';

export const CanvasControls = () => {
    const isMagnet = useCanvasStore((state) => state.isMagnet);
    const showGrid = useCanvasStore((state) => state.showGrid);
    const showAxes = useCanvasStore((state) => state.showAxes);
    const tooltipMode = useCanvasStore((state) => state.tooltipMode);
    const invertY = useCanvasStore((state) => state.invertY);
    const toggleShowGrid = useCanvasStore((state) => state.toggleShowGrid);
    const toggleShowAxes = useCanvasStore((state) => state.toggleShowAxes);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getTooltipIcon = () => {
        switch (tooltipMode) {
            case 'always':
                return Eye;
            case 'hover':
                return EyeClosed;
            case 'never':
                return EyeOff;
        }
    };

    const getTooltipLabel = () => {
        switch (tooltipMode) {
            case 'always':
                return 'Подсказки: Всегда (T)';
            case 'hover':
                return 'Подсказки: При наведении (T)';
            case 'never':
                return 'Подсказки: Никогда (T)';
        }
    };

    const controls = [
        {
            active: tooltipMode !== 'never',
            onClick: toggleTooltipMode,
            Icon: getTooltipIcon(),
            label: getTooltipLabel(),
        },
        {
            active: isMagnet,
            onClick: toggleMagnetMode,
            Icon: Magnet,
            label: 'Магнит (M)',
        },
        {
            active: invertY,
            onClick: toggleInvertY,
            Icon: MoveVertical,
            label: 'Инвертировать Y (Y)',
        },
        {
            active: showGrid,
            onClick: toggleShowGrid,
            Icon: Grid2x2,
            label: 'Сетка (G)',
        },
        {
            active: showAxes,
            onClick: toggleShowAxes,
            Icon: Move3d,
            label: 'Оси (A)',
        },
    ];

    if (!mounted) return null;

    return (
        <>
            <div className="absolute right-0 z-20 flex gap-1">
                {controls.map(({ active, onClick, Icon, label }, index) => (
                    <Tooltip key={index} label={label}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick();
                            }}
                            className={`
                                    p-2 rounded-md w-fit shadow cursor-pointer
                                    ${active ? 'bg-bg-accent text-white' : 'bg-depth-2 hover:bg-depth-3'}
                                `}
                        >
                            <Icon size={16} />
                        </button>
                    </Tooltip>
                ))}
            </div>
        </>
    );
};
