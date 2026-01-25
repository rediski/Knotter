import { useCanvasStore } from '@/canvas/store/canvasStore';
import { Position } from '@/canvas/_core/_/canvas.types';

export function getMousePosition(e: MouseEvent, canvas: HTMLCanvasElement): Position {
    const { offset, zoomLevel, invertY } = useCanvasStore.getState();
    const rect = canvas.getBoundingClientRect();

    const x = (e.clientX - rect.left - offset.x) / zoomLevel;
    const y = invertY
        ? (rect.height - (e.clientY - rect.top) - offset.y) / zoomLevel
        : (e.clientY - rect.top - offset.y) / zoomLevel;

    return { x, y };
}
