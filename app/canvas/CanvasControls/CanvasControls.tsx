'use client';

import { memo, useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';

import { Tooltip } from '@/components/UI/Tooltip';
import { ThemeToggle } from '@/components/ThemeToggle';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { toggleMagnetMode } from '@/canvas/utils/canvas/toggleMagnetMode';
import { toggleTooltipMode } from '@/canvas/utils/canvas/toggleTooltipMode';

import { useCanvasControlsMenu } from '@/canvas/CanvasControls/useCanvasControlsMenu';

import { FlipVertical2, Home, Menu, Magnet, Grid2x2, Move3d, Eye, EyeOff, EyeClosed } from 'lucide-react';

export const CanvasControls = memo(function CanvasControls() {
    const isMagnet = useCanvasStore((state) => state.isMagnet);
    const showGrid = useCanvasStore((state) => state.showGrid);
    const showAxes = useCanvasStore((state) => state.showAxes);
    const tooltipMode = useCanvasStore((state) => state.tooltipMode);
    const invertY = useCanvasStore((state) => state.invertY);
    const setInvertY = useCanvasStore((state) => state.setInvertY);
    const toggleShowGrid = useCanvasStore((state) => state.toggleShowGrid);
    const toggleShowAxes = useCanvasStore((state) => state.toggleShowAxes);

    const { open, menuRef, toggleMenu } = useCanvasControlsMenu();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getTooltipIcon = useCallback(() => {
        switch (tooltipMode) {
            case 'always':
                return Eye;
            case 'hover':
                return EyeClosed;
            case 'never':
                return EyeOff;
        }
    }, [tooltipMode]);

    const getTooltipLabel = useCallback(() => {
        switch (tooltipMode) {
            case 'always':
                return 'Подсказки: Всегда (T)';
            case 'hover':
                return 'Подсказки: При наведении (T)';
            case 'never':
                return 'Подсказки: Никогда (T)';
        }
    }, [tooltipMode]);

    const controls = useMemo(
        () => [
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
        ],
        [tooltipMode, isMagnet, showGrid, showAxes, getTooltipIcon, getTooltipLabel, toggleShowGrid, toggleShowAxes],
    );

    if (!mounted) return null;

    return (
        <div className="flex justify-between items-start gap-12 absolute top-4 left-0 right-0 px-4 z-10 text-sm">
            <div className="flex flex-col gap-2 max-w-60 w-full" ref={menuRef}>
                <button
                    onClick={toggleMenu}
                    className={`
                        p-2 rounded-md w-fit shadow cursor-pointer 
                        ${open ? 'bg-bg-accent text-white' : 'bg-depth-2 hover:bg-depth-3'}
                    `}
                >
                    <Menu size={16} />
                </button>

                {open && (
                    <div className="flex flex-col bg-depth-1 rounded-md shadow w-full text-nowrap">
                        <div className="flex flex-col gap-1 m-1">
                            <button
                                onClick={() => setInvertY(!invertY)}
                                className="px-3 py-2 w-full flex justify-between bg-depth-2 hover:bg-depth-3 rounded-md cursor-pointer"
                            >
                                Инвертировать Y
                                <FlipVertical2 size={16} className={`${invertY ? 'text-foreground' : 'text-gray'}`} />
                            </button>

                            <ThemeToggle label="Ночной режим" className="px-3 py-2 w-full flex justify-between" />
                        </div>

                        <hr className="border-b-0 border-depth-3" />

                        <div className="m-1">
                            <Link
                                href="/"
                                className="flex items-center justify-between gap-2 bg-depth-2 hover:bg-depth-3 px-3 py-2 rounded-md text-red"
                            >
                                На главную
                                <Home size={16} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
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
        </div>
    );
});
