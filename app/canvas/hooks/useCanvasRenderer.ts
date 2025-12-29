'use client';

import { useEffect, RefObject } from 'react';

import { Node, Edge, Position } from '@/canvas/canvas.types';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { drawEdges } from '@/canvas/utils/edges/drawEdges';
import { drawSelectionBox } from '@/canvas/utils/canvas/drawSelectionBox';
import { drawTempEdge } from '@/canvas/utils/edges/drawTempEdge';
import { drawGrid } from '@/canvas/utils/canvas/drawGrid';
import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getEdges } from '@/canvas/utils/edges/getEdges';

interface useCanvasRendererProps {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    selectionStart: Position | null;
    selectionEnd: Position | null;
}

export function useCanvasRenderer({ canvasRef, selectionStart, selectionEnd }: useCanvasRendererProps) {
    const items = useCanvasStore((s) => s.items);
    const selectedItemIds = useCanvasStore((s) => s.selectedItemIds);
    const offset = useCanvasStore((state) => state.offset);
    const zoomLevel = useCanvasStore((state) => state.zoomLevel);
    const invertY = useCanvasStore((state) => state.invertY);
    const showGrid = useCanvasStore((s) => s.showGrid);
    const showAxes = useCanvasStore((s) => s.showAxes);
    const tempEdge = useCanvasStore((s) => s.tempEdge);
    const hoveredNodeId = useCanvasStore((s) => s.hoveredNodeId);
    const tooltipMode = useCanvasStore((s) => s.tooltipMode);

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

            const nodes: Node[] = getNodes(items);
            const edges: Edge[] = getEdges(items);

            drawEdges(ctx, nodes, selectedItemIds, edges);

            if (selectionStart && selectionEnd) {
                drawSelectionBox(ctx, selectionStart, selectionEnd);
            }

            drawTempEdge(ctx, nodes, tempEdge);
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
    }, [
        canvasRef,
        items,
        selectedItemIds,
        selectionStart,
        selectionEnd,
        tempEdge,
        showGrid,
        showAxes,
        zoomLevel,
        offset,
        invertY,
        hoveredNodeId,
        tooltipMode,
    ]);
}
