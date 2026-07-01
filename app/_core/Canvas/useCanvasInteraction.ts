'use client';

import { useEffect, RefObject } from 'react';

import { useCanvasMouseEvents } from '@/_core/Canvas/useCanvasMouseEvents';

import { getPanEventHandler } from '@/utils/eventHandlers/getPanEventHandler';
import { getScrollEventHandler } from '@/utils/eventHandlers/getScrollEventHandler';
import { getSelectionEventHandler } from '@/utils/eventHandlers/getSelectionEventHandler';
import { getZoomEventHandler } from '@/utils/eventHandlers/getZoomEventHandler';

interface useCanvasInteractionProps {
    containerRef: RefObject<HTMLDivElement | null>;
    canvasRef: RefObject<HTMLCanvasElement | null>;
}

export function useCanvasInteraction({ containerRef, canvasRef }: useCanvasInteractionProps) {
    const { onMouseDown, onMouseMove, onMouseUp } = useCanvasMouseEvents(canvasRef);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;

        if (!container || !canvas) return;

        const pan = getPanEventHandler();
        const scroll = getScrollEventHandler();
        const zoom = getZoomEventHandler(canvasRef);

        const select = getSelectionEventHandler(canvasRef);

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
            onMouseUp();
        };

        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault();
                zoom(e);
                return;
            }

            const isTouchpadPan = pan.handleWheelForTouchpad(e);

            if (isTouchpadPan) e.preventDefault();
            if (!isTouchpadPan) scroll(e);
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
