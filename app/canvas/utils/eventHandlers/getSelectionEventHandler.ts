import { RefObject } from 'react';
import { Position } from '@/canvas/canvas.types';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { findCanvasUnderCursor } from '@/canvas/utils/canvas/findCanvasUnderCursor';

export function getSelectionEventHandler(
    canvasRef: RefObject<HTMLCanvasElement | null>,
    selectionStart: Position | null,
    setSelectionStart: (value: Position | null) => void,
    setSelectionEnd: (value: Position | null) => void,
    selectItemsInArea?: (start: Position, end: Position) => void,
) {
    const handleMouseDown = (e: MouseEvent) => {
        if (e.button !== 0) return;

        if (!findCanvasUnderCursor(e, canvasRef.current)) return;

        const mousePos = useCanvasStore.getState().mousePosition;

        setSelectionStart(mousePos);
        setSelectionEnd(mousePos);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!selectionStart || (e.buttons & 1) !== 1) return;

        const mousePos = useCanvasStore.getState().mousePosition;
        setSelectionEnd(mousePos);

        selectItemsInArea?.(selectionStart, mousePos);
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (!selectionStart || e.button !== 0) return;

        const mousePos = useCanvasStore.getState().mousePosition;

        selectItemsInArea?.(selectionStart, mousePos);

        setSelectionStart(null);
        setSelectionEnd(null);
    };

    return { handleMouseDown, handleMouseMove, handleMouseUp };
}
