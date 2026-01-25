import { CanvasItem, Position } from '@/canvas/_core/_/canvas.types';

export function getItemsInSelectionArea(items: CanvasItem[], selectionStart: Position, selectionEnd: Position): string[] {
    const left = Math.min(selectionStart.x, selectionEnd.x);
    const right = Math.max(selectionStart.x, selectionEnd.x);
    const top = Math.min(selectionStart.y, selectionEnd.y);
    const bottom = Math.max(selectionStart.y, selectionEnd.y);

    const bounds = { left, right, top, bottom };

    return items
        .filter((item) => {
            const { x, y } = item.position;

            const insideX = x >= bounds.left && x <= bounds.right;
            const insideY = y >= bounds.top && y <= bounds.bottom;

            return insideX && insideY;
        })
        .map((item) => item.id);
}
