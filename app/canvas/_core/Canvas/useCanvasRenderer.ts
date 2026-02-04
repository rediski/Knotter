'use client';

import { useEffect, RefObject } from 'react';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { drawGrid } from '@/canvas/utils/canvas/drawGrid';

interface useCanvasRendererProps {
    canvasRef: RefObject<HTMLCanvasElement | null>;
}

export function useCanvasRenderer({ canvasRef }: useCanvasRendererProps) {
    const offset = useCanvasStore((state) => state.offset);
    const zoomLevel = useCanvasStore((state) => state.zoomLevel);
    const invertY = useCanvasStore((state) => state.invertY);
    const showGrid = useCanvasStore((state) => state.showGrid);
    const showAxes = useCanvasStore((state) => state.showAxes);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number | null = null;

        const renderCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;

            const pixelWidth = Math.round(width * dpr);
            const pixelHeight = Math.round(height * dpr);

            if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
                canvas.width = pixelWidth;
                canvas.height = pixelHeight;
            }

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const scaleY = invertY ? -zoomLevel * dpr : zoomLevel * dpr;
            const translateY = invertY ? canvas.height - offset.y * dpr : offset.y * dpr;

            ctx.setTransform(zoomLevel * dpr, 0, 0, scaleY, offset.x * dpr, translateY);

            drawGrid(ctx, canvas.width / dpr, canvas.height / dpr, showGrid, showAxes);
        };

        const scheduleRender = () => {
            if (animationFrameId != null) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(renderCanvas);
        };

        scheduleRender();

        const resizeObserver = new ResizeObserver(scheduleRender);
        resizeObserver.observe(canvas);

        const themeObserver = new MutationObserver(() => scheduleRender());
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        return () => {
            if (animationFrameId != null) cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
            themeObserver.disconnect();
        };
    }, [canvasRef, zoomLevel, offset, invertY, showGrid, showAxes]);
}
