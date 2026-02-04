'use client';

import { useMemo, RefObject } from 'react';
import type { Position } from '@/canvas/_core/_/canvas.types';
import { useCanvasStore } from '@/canvas/store/canvasStore';

interface SelectionBoxProps {
    start: Position | null;
    end: Position | null;
    containerRef: RefObject<HTMLDivElement | null>;
}

export function SelectionBox({ start, end, containerRef }: SelectionBoxProps) {
    const offset = useCanvasStore((state) => state.offset);
    const zoomLevel = useCanvasStore((state) => state.zoomLevel);
    const invertY = useCanvasStore((state) => state.invertY);

    const rect = useMemo(() => {
        if (!start || !end) {
            return { left: 0, top: 0, width: 0, height: 0 };
        }

        const width = Math.abs(end.x - start.x) * zoomLevel;
        const height = Math.abs(end.y - start.y) * zoomLevel;

        const left = Math.min(start.x, end.x) * zoomLevel + offset.x;
        let top = Math.min(start.y, end.y) * zoomLevel + offset.y;

        const containerHeight = containerRef.current?.offsetHeight ?? 0;

        if (invertY) {
            top = containerHeight - top - height;
        }

        return { left, top, width, height };
    }, [start, end, offset, zoomLevel, invertY, containerRef]);

    if (!start || !end) return null;

    return (
        <div
            className="absolute pointer-events-none border-2 border-bg-accent bg-bg-accent/30"
            style={{
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
            }}
        />
    );
}
