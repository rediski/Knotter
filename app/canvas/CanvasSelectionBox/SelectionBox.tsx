'use client';

import { useMemo } from 'react';
import type { Position } from '@/canvas/_core/_/canvas.types';
import { useCanvasStore } from '@/canvas/store/canvasStore';

interface SelectionBoxProps {
    start: Position | null;
    end: Position | null;
}

export function SelectionBox({ start, end }: SelectionBoxProps) {
    const { offset, zoomLevel } = useCanvasStore();

    const rect = useMemo(() => {
        if (start === null || end === null) {
            return { left: 0, top: 0, width: 0, height: 0 };
        }

        const left = Math.min(start.x, end.x) * zoomLevel + offset.x;
        const top = Math.min(start.y, end.y) * zoomLevel + offset.y;
        const width = Math.abs(end.x - start.x) * zoomLevel;
        const height = Math.abs(end.y - start.y) * zoomLevel;

        return { left, top, width, height };
    }, [start, end, offset, zoomLevel]);

    if (start === null || end === null) return null;

    return (
        <div
            className="absolute pointer-events-none border-2 border-bg-accent bg-blue-500/20"
            style={{
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
            }}
        />
    );
}
