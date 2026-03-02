import { useCanvasStore } from '@/canvas/store/useCanvasStore';

export const getScreenCoords = (x: number, y: number, containerRef: React.RefObject<HTMLDivElement | null>) => {
    const zoomLevel = useCanvasStore.getState().zoomLevel;
    const offset = useCanvasStore.getState().offset;
    const invertY = useCanvasStore.getState().invertY;

    const baseX = x * zoomLevel + offset.x;
    const baseY = y * zoomLevel + offset.y;

    if (invertY && containerRef.current) {
        const containerHeight = containerRef.current.offsetHeight;
        const screenY = -baseY + containerHeight;

        return { x: baseX, y: screenY };
    }

    return { x: baseX, y: baseY };
};
