import { useCanvasStore } from '@/store/useCanvasStore';

export function getWorldCoords(canvasWidth: number, canvasHeight: number) {
    const canvasState = useCanvasStore.getState();

    const offset = canvasState.offset;
    const zoomLevel = canvasState.zoomLevel;

    const left = -offset.x / zoomLevel;
    const top = -offset.y / zoomLevel;

    return {
        left,
        top,
        right: left + canvasWidth / zoomLevel,
        bottom: top + canvasHeight / zoomLevel,
    };
}
