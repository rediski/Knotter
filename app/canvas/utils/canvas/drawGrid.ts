import { NODE_MOVE_MAX_STEP } from '@/canvas/_core/_/canvas.constants';
import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { getWorldCoords } from '@/canvas/utils/canvas/getWorldCoords';

interface DrawGridParams {
    ctx: CanvasRenderingContext2D;
    canvasWidth: number;
    canvasHeight: number;
}

export function drawGrid({ ctx, canvasWidth, canvasHeight }: DrawGridParams) {
    const canvasState = useCanvasStore.getState();

    const zoomLevel = canvasState.zoomLevel;
    const showGrid = canvasState.showGrid;
    const showAxes = canvasState.showAxes;

    const baseGridSize = NODE_MOVE_MAX_STEP;

    const world = getWorldCoords(canvasWidth, canvasHeight);

    const styles = getComputedStyle(document.documentElement);

    const gridColor1 = styles.getPropertyValue('--grid-color-1').trim();
    const gridColor2 = styles.getPropertyValue('--grid-color-2').trim();
    const gridColor3 = styles.getPropertyValue('--grid-color-3').trim();
    const axisXColor = styles.getPropertyValue('--red').trim();
    const axisYColor = styles.getPropertyValue('--green').trim();

    const dpr = window.devicePixelRatio || 1;

    ctx.lineWidth = (1 / zoomLevel) * dpr;

    if (showGrid) {
        const levels = [
            { step: baseGridSize, color: gridColor1 },
            { step: baseGridSize * 10, color: gridColor2 },
            { step: baseGridSize * 100, color: gridColor3 },
        ];

        for (const { step, color } of levels) {
            if (step * zoomLevel < 8) continue;

            ctx.beginPath();
            ctx.strokeStyle = color;

            const startX = Math.floor(world.left / step) * step;

            for (let x = startX; x <= world.right; x += step) {
                ctx.moveTo(x, world.top);
                ctx.lineTo(x, world.bottom);
            }

            const startY = Math.floor(world.top / step) * step;

            for (let y = startY; y <= world.bottom; y += step) {
                ctx.moveTo(world.left, y);
                ctx.lineTo(world.right, y);
            }

            ctx.stroke();
        }
    }

    if (showAxes) {
        ctx.beginPath();
        ctx.strokeStyle = axisYColor;
        ctx.moveTo(0, world.top);
        ctx.lineTo(0, world.bottom);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = axisXColor;
        ctx.moveTo(world.left, 0);
        ctx.lineTo(world.right, 0);
        ctx.stroke();
    }
}
