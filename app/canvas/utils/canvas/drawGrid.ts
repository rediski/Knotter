import { useCanvasStore } from '@/canvas/store/canvasStore';

import { NODE_MOVE_MAX_STEP } from '@/canvas/_core/_/canvas.constants';

export function drawGrid(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    showGrid = false,
    showAxes = false,
) {
    const offset = useCanvasStore.getState().offset;
    const zoomLevel = useCanvasStore.getState().zoomLevel;

    const baseGridSize = NODE_MOVE_MAX_STEP;

    const lineWidth = 1 / zoomLevel;
    ctx.lineWidth = lineWidth;

    const worldLeft = -offset.x / zoomLevel;
    const worldTop = -offset.y / zoomLevel;
    const worldRight = worldLeft + canvasWidth / zoomLevel;
    const worldBottom = worldTop + canvasHeight / zoomLevel;

    const styles = getComputedStyle(document.documentElement);

    const gridColor1 = styles.getPropertyValue('--grid-color-1').trim();
    const gridColor2 = styles.getPropertyValue('--grid-color-2').trim();
    const gridColor3 = styles.getPropertyValue('--grid-color-3').trim();
    const axisXColor = styles.getPropertyValue('--red').trim();
    const axisYColor = styles.getPropertyValue('--green').trim();

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

            const startX = Math.floor(worldLeft / step) * step;

            for (let x = startX; x <= worldRight; x += step) {
                ctx.moveTo(x, worldTop);
                ctx.lineTo(x, worldBottom);
            }

            const startY = Math.floor(worldTop / step) * step;

            for (let y = startY; y <= worldBottom; y += step) {
                ctx.moveTo(worldLeft, y);
                ctx.lineTo(worldRight, y);
            }

            ctx.stroke();
        }
    }

    if (showAxes) {
        ctx.beginPath();
        ctx.strokeStyle = axisYColor;
        ctx.moveTo(0, worldTop);
        ctx.lineTo(0, worldBottom);
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = axisXColor;
        ctx.moveTo(worldLeft, 0);
        ctx.lineTo(worldRight, 0);
        ctx.stroke();
    }
}
