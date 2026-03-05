'use client';

import { useEffect, useCallback, type RefObject } from 'react';
import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { drawGrid } from '@/canvas/utils/canvas/drawGrid';

export function useCanvasRenderer(canvasRef: RefObject<HTMLCanvasElement | null>) {
    const setOffset = useCanvasStore((state) => state.setOffset);
    const offset = useCanvasStore((state) => state.offset);
    const invertY = useCanvasStore((state) => state.invertY);

    const isInitialOffsetSet = offset.x !== 0 || offset.y !== 0;

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
