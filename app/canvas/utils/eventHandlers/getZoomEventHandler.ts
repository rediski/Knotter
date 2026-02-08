import { RefObject } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { MIN_ZOOM, MAX_ZOOM } from '@/canvas/_core/_/canvas.constants';

const ZOOM_FACTOR = 1.1;

export function getZoomEventHandler(canvasRef: RefObject<HTMLCanvasElement | null>) {
    return (e: WheelEvent) => {
        if (!e.ctrlKey) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const offset = useCanvasStore.getState().offset;
        const setOffset = useCanvasStore.getState().setOffset;
        const zoomLevel = useCanvasStore.getState().zoomLevel;
        const setZoomLevel = useCanvasStore.getState().setZoomLevel;
        const invertY = useCanvasStore.getState().invertY;

        const scale = e.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel * scale));

        const cursorY = invertY ? canvas.height - mouseY : mouseY;

        const newOffsetX = mouseX - (mouseX - offset.x) * (newZoom / zoomLevel);
        const newOffsetY = cursorY - (cursorY - offset.y) * (newZoom / zoomLevel);

        setOffset({ x: newOffsetX, y: newOffsetY });
        setZoomLevel(newZoom);
    };
}
