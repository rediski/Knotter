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

    useEffect(() => {
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

    useEffect(() => {
        const unsubscribe = useCanvasStore.subscribe(() => {
            requestAnimationFrame(renderCanvas);
        });

        requestAnimationFrame(renderCanvas);

        return unsubscribe;
    }, [renderCanvas]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let frame: number;
        const onRender = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(renderCanvas);
        };

        const resize = new ResizeObserver(onRender);
        resize.observe(canvas);

        const theme = new MutationObserver(onRender);
        theme.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        return () => {
            resize.disconnect();
            theme.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [canvasRef, renderCanvas]);
}
