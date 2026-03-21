'use client';

import { useEffect, useCallback, type RefObject } from 'react';
import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { drawCanvas } from '@/canvas/utils/canvas/drawCanvas';

export function useCanvasRenderer(canvasRef: RefObject<HTMLCanvasElement | null>) {
    const setOffset = useCanvasStore((state) => state.setOffset);
    const offset = useCanvasStore((state) => state.offset);
    const invertY = useCanvasStore((state) => state.invertY);

    const isInitialOffsetSet = offset.x !== 0 || offset.y !== 0;

    const renderCanvas = useCallback(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            drawCanvas(canvas);
        }
    }, [canvasRef]);

    const initializeCanvasOffset = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || isInitialOffsetSet) return;

        const rect = canvas.getBoundingClientRect();

        if (rect.width > 0 && rect.height > 0) {
            setOffset({
                x: rect.width / 2,
                y: invertY ? rect.height / 2 : -rect.height / 2,
            });
        }
    }, [canvasRef, isInitialOffsetSet, setOffset, invertY]);

    const subscribeToStoreChanges = useCallback(() => {
        const unsubscribe = useCanvasStore.subscribe(() => {
            requestAnimationFrame(renderCanvas);
        });

        requestAnimationFrame(renderCanvas);

        return unsubscribe;
    }, [renderCanvas]);

    const observeCanvasResizeAndTheme = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let frame: number;

        const scheduleRender = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(renderCanvas);
        };

        const resizeObserver = new ResizeObserver(scheduleRender);
        resizeObserver.observe(canvas);

        const themeObserver = new MutationObserver(scheduleRender);
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        return () => {
            resizeObserver.disconnect();
            themeObserver.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [canvasRef, renderCanvas]);

    useEffect(() => {
        initializeCanvasOffset();
    }, [initializeCanvasOffset]);

    useEffect(() => {
        return subscribeToStoreChanges();
    }, [subscribeToStoreChanges]);

    useEffect(() => {
        return observeCanvasResizeAndTheme();
    }, [observeCanvasResizeAndTheme]);
}
