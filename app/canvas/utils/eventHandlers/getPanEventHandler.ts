import { useCanvasStore } from '@/canvas/store/canvasStore';
import { useCanvasRefsStore } from '@/canvas/store/canvasRefStore';

export function getPanEventHandler() {
    const isPanning = useCanvasRefsStore.getState().isPanning;
    const lastMouseRef = useCanvasRefsStore.getState().lastMouseRef;

    const handleMouseDown = (e: MouseEvent) => {
        if (e.button !== 1) return;

        e.preventDefault();

        isPanning.current = true;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };

        document.body.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isPanning.current || !lastMouseRef.current) return;

        const dx = e.clientX - lastMouseRef.current.x;
        const dy = e.clientY - lastMouseRef.current.y;

        useCanvasStore.setState(
            (state) => ({
                offset: {
                    x: state.offset.x + dx,
                    y: state.offset.y + (state.invertY ? -dy : dy),
                },
            }),

            false,
        );

        lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        isPanning.current = false;
        lastMouseRef.current = null;
        document.body.style.cursor = '';
    };

    const handleWheelForTouchpad = (e: WheelEvent) => {
        const isLikelyTouchpad = Math.abs(e.deltaX) > 0 || Math.abs(e.deltaY) % 1 !== 0;

        if (isLikelyTouchpad && !e.ctrlKey) {
            useCanvasStore.setState(
                (state) => ({
                    offset: {
                        x: state.offset.x - e.deltaX,
                        y: state.offset.y - (state.invertY ? -e.deltaY : e.deltaY),
                    },
                }),
                false,
            );

            return true;
        }

        return false;
    };

    return {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleWheelForTouchpad,
    };
}
