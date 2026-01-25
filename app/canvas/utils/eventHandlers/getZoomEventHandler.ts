import { useCanvasStore } from '@/canvas/store/canvasStore';
import { MIN_ZOOM, MAX_ZOOM } from '@/canvas/_core/_/canvas.constants';

export function getZoomEventHandler(canvas: HTMLCanvasElement) {
    return (e: WheelEvent) => {
        if (!e.ctrlKey) return;
        e.preventDefault();

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const { offset, setOffset, zoomLevel, setZoomLevel, invertY } = useCanvasStore.getState();

        const zoomFactor = 1.1;
        const scale = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel * scale));

        const cursorY = invertY ? canvas.height - mouseY : mouseY;

        const newOffsetX = mouseX - (mouseX - offset.x) * (newZoom / zoomLevel);
        const newOffsetY = cursorY - (cursorY - offset.y) * (newZoom / zoomLevel);

        setOffset({ x: newOffsetX, y: newOffsetY });
        setZoomLevel(newZoom);
    };
}
