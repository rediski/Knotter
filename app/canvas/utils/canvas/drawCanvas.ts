import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { drawGrid } from '@/canvas/utils/canvas/drawGrid';
import { initCanvasContext } from '@/canvas/utils/canvas/initCanvasContext';

export function drawCanvas(canvas: HTMLCanvasElement) {
    const context = initCanvasContext(canvas);
    if (!context) return;

    const { ctx, dpr, displayWidth, displayHeight } = context;
    const state = useCanvasStore.getState();

    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaleY = state.invertY ? -state.zoomLevel * dpr : state.zoomLevel * dpr;
    const translateY = state.invertY ? canvas.height - state.offset.y * dpr : state.offset.y * dpr;

    ctx.setTransform(state.zoomLevel * dpr, 0, 0, scaleY, state.offset.x * dpr, translateY);

    drawGrid({
        ctx,
        canvasWidth: displayWidth,
        canvasHeight: displayHeight,
    });
}
