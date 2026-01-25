import { Position } from '@/canvas/_core/_/canvas.types';

export function drawSelectionBox(ctx: CanvasRenderingContext2D, start: Position, end: Position) {
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);

    ctx.save();
    ctx.fillStyle = 'rgba(0, 120, 215, 0.3)';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = 'rgba(0, 120, 215, 1)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
}
