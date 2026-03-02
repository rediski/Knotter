'use client';

import { useItemsStore } from '@/canvas/store/useItemsStore';
import { useCanvasStore } from '@/canvas/store/useCanvasStore';

interface SelectionBoxProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export function SelectionBox({ containerRef }: SelectionBoxProps) {
    const offset = useCanvasStore((state) => state.offset);
    const zoomLevel = useCanvasStore((state) => state.zoomLevel);
    const invertY = useCanvasStore((state) => state.invertY);
    const selectionStart = useItemsStore((state) => state.selectionStart);
    const selectionEnd = useItemsStore((state) => state.selectionEnd);

    if (!selectionStart || !selectionEnd) return null;

    const width = Math.abs(selectionEnd.x - selectionStart.x) * zoomLevel;
    const height = Math.abs(selectionEnd.y - selectionStart.y) * zoomLevel;

    const left = Math.min(selectionStart.x, selectionEnd.x) * zoomLevel + offset.x;
    let top = Math.min(selectionStart.y, selectionEnd.y) * zoomLevel + offset.y;

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
