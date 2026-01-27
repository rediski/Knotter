'use client';

import { useEffect, RefObject, useRef } from 'react';
import { Position } from '@/canvas/_core/_/canvas.types';

import { useInitialCanvasOffset } from '@/canvas/_core/Canvas/useInitialCanvasOffset';
import { useCanvasHotkeys } from '@/canvas/_core/Canvas/useCanvasHotkeys';
import { useCanvasMouseEvents } from '@/canvas/_core/Canvas/useCanvasMouseEvents';

import { getPanEventHandler } from '@/canvas/utils/eventHandlers/getPanEventHandler';
import { getScrollEventHandler } from '@/canvas/utils/eventHandlers/getScrollEventHandler';
import { getSelectionEventHandler } from '@/canvas/utils/eventHandlers/getSelectionEventHandler';
import { getZoomEventHandler } from '@/canvas/utils/eventHandlers/getZoomEventHandler';

interface useCanvasInteractionProps {
    containerRef: RefObject<HTMLDivElement | null>;
    canvasRef: RefObject<HTMLCanvasElement | null>;
    setSelectionStart: (value: Position | null) => void;
    setSelectionEnd: (value: Position | null) => void;
    selectItemsInArea: (start: Position, end: Position) => void;
}

export function useCanvasInteraction({
    containerRef,
    canvasRef,
    setSelectionStart,
    setSelectionEnd,
    selectItemsInArea,
}: useCanvasInteractionProps) {
    useInitialCanvasOffset(canvasRef);
    useCanvasHotkeys(canvasRef);

    const isPanningRef = useRef(false);
    const lastMouseRef = useRef<{ x: number; y: number } | null>(null);
    const selectionStartRef = useRef<Position | null>(null);

    const { onMouseDown, onMouseMove, onMouseUp } = useCanvasMouseEvents(canvasRef, isPanningRef);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;

        if (!container || !canvas) return;

        const pan = getPanEventHandler({ isPanningRef, lastMouseRef });
        const scroll = getScrollEventHandler();
        const zoom = getZoomEventHandler(canvas);

        const select = getSelectionEventHandler(
            canvasRef,
            selectionStartRef,
            setSelectionStart,
            setSelectionEnd,
            selectItemsInArea,
        );

        const handleMouseDown = (e: MouseEvent) => {
            select.handleMouseDown(e);
            pan.handleMouseDown(e);
            onMouseDown(e);
        };

        const handleMouseMove = (e: MouseEvent) => {
            select.handleMouseMove(e);
            pan.handleMouseMove(e);
            onMouseMove(e);
        };

        const handleMouseUp = (e: MouseEvent) => {
            select.handleMouseUp(e);
            pan.handleMouseUp();
            onMouseUp(e);
        };

        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault();
                zoom(e);
                return;
            }

            const isTouchpadPan = pan.handleWheelForTouchpad(e);

            if (isTouchpadPan) {
                e.preventDefault();
            }

            if (!isTouchpadPan) {
                scroll(e);
            }
        };

        container.addEventListener('mousedown', handleMouseDown);
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('wheel', handleWheel, { passive: false });

        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            container.removeEventListener('mousedown', handleMouseDown);
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('wheel', handleWheel);

            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [containerRef, canvasRef, onMouseDown, onMouseMove, onMouseUp]);
}
