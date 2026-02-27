'use client';

import { useEffect, useCallback, type RefObject } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { drawGrid } from '@/canvas/utils/canvas/drawGrid';

export function useCanvasRenderer({ canvasRef }: { canvasRef: RefObject<HTMLCanvasElement | null> }) {
    const renderCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const state = useCanvasStore.getState();

        const offset = state.offset;
        const zoomLevel = state.zoomLevel;
        const invertY = state.invertY;
        const showGrid = state.showGrid;
        const showAxes = state.showAxes;

        const dpr = window.devicePixelRatio || 1;

        const canvasWidth = canvas.clientWidth;
        const canvasHeight = canvas.clientHeight;

        const pixelWidth = Math.round(canvasWidth * dpr);
        const pixelHeight = Math.round(canvasHeight * dpr);

        if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
            canvas.width = pixelWidth;
            canvas.height = pixelHeight;
        }

        ctx.resetTransform();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scaleY = invertY ? -zoomLevel * dpr : zoomLevel * dpr;
        const translateY = invertY ? canvas.height - offset.y * dpr : offset.y * dpr;

        ctx.setTransform(zoomLevel * dpr, 0, 0, scaleY, offset.x * dpr, translateY);

        drawGrid({
            ctx,
            canvasWidth,
            canvasHeight,
            offset,
            zoomLevel,
            showGrid,
            showAxes,
        });
    }, [canvasRef]);

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

        let animationFrame: number;

        const scheduleRender = () => {
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(renderCanvas);
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
            cancelAnimationFrame(animationFrame);
        };
    }, [canvasRef, renderCanvas]);
}
