'use client';

import type { Position } from '@/canvas/_core/_/canvas.types';
import { useCanvasStore } from '@/canvas/store/canvasStore';

interface SelectionBoxProps {
    selectionStartRef: React.RefObject<Position | null>;
    selectionEndRef: React.RefObject<Position | null>;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export function SelectionBox({ selectionStartRef, selectionEndRef, containerRef }: SelectionBoxProps) {
    const offset = useCanvasStore((state) => state.offset);
    const zoomLevel = useCanvasStore((state) => state.zoomLevel);
    const invertY = useCanvasStore((state) => state.invertY);

    const start = selectionStartRef.current;
    const end = selectionEndRef.current;

    if (!start || !end) return null;

    const width = Math.abs(end.x - start.x) * zoomLevel;
    const height = Math.abs(end.y - start.y) * zoomLevel;

    const left = Math.min(start.x, end.x) * zoomLevel + offset.x;
    let top = Math.min(start.y, end.y) * zoomLevel + offset.y;

    const containerHeight = containerRef.current?.offsetHeight ?? 0;

    if (invertY) {
        top = containerHeight - top - height;
    }

    return (
        <div
            className="absolute pointer-events-none border-2 border-bg-accent bg-bg-accent/30"
            style={{ left, top, width, height }}
        />
    );
}
