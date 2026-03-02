import { useCanvasStore } from '@/canvas/store/useCanvasStore';

export function getScrollEventHandler() {
    return (e: WheelEvent) => {
        if (e.ctrlKey) return;

        e.preventDefault();

        const dx = e.shiftKey ? e.deltaY : 0;
        const dy = !e.shiftKey ? e.deltaY : 0;

        const offset = useCanvasStore.getState().offset;
        const setOffset = useCanvasStore.getState().setOffset;
        const invertY = useCanvasStore.getState().invertY;

        setOffset({
            x: offset.x - dx,
            y: offset.y - (invertY ? -dy : dy),
        });
    };
}
