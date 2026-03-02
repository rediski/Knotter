import type { Position } from '@/canvas/_core/_/canvas.types';
import { useCanvasStore } from '@/canvas/store/useCanvasStore';

export function getMousePosition(e: MouseEvent, canvas: HTMLCanvasElement): Position {
    const rect = canvas.getBoundingClientRect();

    const offset = useCanvasStore.getState().offset;
    const zoomLevel = useCanvasStore.getState().zoomLevel;
    const invertY = useCanvasStore.getState().invertY;

    return {
        x: (e.clientX - rect.left - offset.x) / zoomLevel,
        y: invertY
            ? (rect.height - (e.clientY - rect.top) - offset.y) / zoomLevel
            : (e.clientY - rect.top - offset.y) / zoomLevel,
    };
}
