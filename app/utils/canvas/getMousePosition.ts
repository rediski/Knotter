import type { Position } from '@/_core/_/canvas.types';
import { useCanvasStore } from '@/store/useCanvasStore';

export function getMousePosition(e: MouseEvent, canvas: HTMLCanvasElement): Position {
    const rect = canvas.getBoundingClientRect();

    const canvasState = useCanvasStore.getState();

    const offset = canvasState.offset;
    const zoomLevel = canvasState.zoomLevel;
    const invertY = canvasState.invertY;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const adjustedY = invertY ? rect.height - mouseY : mouseY;

    return {
        x: (mouseX - offset.x) / zoomLevel,
        y: (adjustedY - offset.y) / zoomLevel,
    };
}
