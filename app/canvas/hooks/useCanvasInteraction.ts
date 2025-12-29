'use client';

import { useEffect, RefObject, useRef } from 'react';
import { Position } from '@/canvas/canvas.types';

import { useInitialCanvasOffset } from '@/canvas/hooks/useInitialCanvasOffset';
import { useCanvasHotkeys } from '@/canvas/hooks/useCanvasHotkeys';
import { useCanvasMouseEvents } from '@/canvas/hooks/useCanvasMouseEvents';

import { getPanEventHandler } from '@/canvas/utils/eventHandlers/getPanEventHandler';
import { getScrollEventHandler } from '@/canvas/utils/eventHandlers/getScrollEventHandler';
import { getSelectionEventHandler } from '@/canvas/utils/eventHandlers/getSelectionEventHandler';
import { getZoomEventHandler } from '@/canvas/utils/eventHandlers/getZoomEventHandler';

interface useCanvasInteractionProps {
    containerRef: RefObject<HTMLDivElement | null>;
    canvasRef: RefObject<HTMLCanvasElement | null>;
    selectionStart: Position | null;
    setSelectionStart: (value: Position | null) => void;
    setSelectionEnd: (value: Position | null) => void;
    selectItemsInArea: (start: Position, end: Position) => void;
}

export function useCanvasInteraction({
    containerRef,
    canvasRef,
    selectionStart,
    setSelectionStart,
    setSelectionEnd,
    selectItemsInArea,
}: useCanvasInteractionProps) {
    useInitialCanvasOffset(canvasRef);
    useCanvasHotkeys(canvasRef);

    const isPanningRef = useRef(false);
    const lastMouseRef = useRef<{ x: number; y: number } | null>(null);

    const { onMouseDown, onMouseMove, onMouseUp } = useCanvasMouseEvents(canvasRef, isPanningRef);

    const panHandlers = useRef<ReturnType<typeof getPanEventHandler> | null>(null);
    const selectHandlers = useRef<ReturnType<typeof getSelectionEventHandler> | null>(null);
    const handleScroll = useRef(getScrollEventHandler());
    const handleZoom = useRef<((e: WheelEvent) => void) | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;

        if (!container || !canvas) return;

        panHandlers.current = getPanEventHandler({ isPanningRef, lastMouseRef });

        selectHandlers.current = getSelectionEventHandler(
            canvasRef,
            selectionStart,
            setSelectionStart,
            setSelectionEnd,
            selectItemsInArea,
        );

        handleZoom.current = getZoomEventHandler(canvas);

        const handleMouseDown: (e: MouseEvent) => void = (e) => {
            panHandlers.current?.handleMouseDown(e);
            onMouseDown(e);
            selectHandlers.current?.handleMouseDown(e);
        };

        const handleMouseMove: (e: MouseEvent) => void = (e) => {
            panHandlers.current?.handleMouseMove(e);
            onMouseMove(e);
            selectHandlers.current?.handleMouseMove(e);
        };

        const handleMouseUp: (e: MouseEvent) => void = (e) => {
            panHandlers.current?.handleMouseUp();
            onMouseUp(e);
            selectHandlers.current?.handleMouseUp(e);
        };

        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault();
                handleZoom.current?.(e);
                return;
            }

            const isTouchpadPan = panHandlers.current?.handleWheelForTouchpad(e);

            if (isTouchpadPan) {
                e.preventDefault();
            }

            if (!isTouchpadPan) {
                handleScroll.current?.(e);
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
    }, [
        containerRef,
        canvasRef,
        selectionStart,
        setSelectionStart,
        setSelectionEnd,
        selectItemsInArea,
        onMouseDown,
        onMouseMove,
        onMouseUp,
    ]);
}
