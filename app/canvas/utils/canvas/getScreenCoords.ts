import { useCanvasStore } from '@/canvas/store/useCanvasStore';

export const getScreenCoords = (x: number, y: number, containerRef: React.RefObject<HTMLDivElement | null>) => {
    const canvasState = useCanvasStore.getState();

    const zoomLevel = canvasState.zoomLevel;
    const offset = canvasState.offset;
    const invertY = canvasState.invertY;

    const baseX = x * zoomLevel + offset.x;
    const baseY = y * zoomLevel + offset.y;

    if (invertY && containerRef.current) {
        const containerHeight = containerRef.current.offsetHeight;
        const screenY = -baseY + containerHeight;

        return { x: baseX, y: screenY };
    }

    return { x: baseX, y: baseY };
};
