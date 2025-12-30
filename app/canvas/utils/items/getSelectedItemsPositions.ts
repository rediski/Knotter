import { CanvasItem, Position } from '@/canvas/canvas.types';

export function getSelectedItemsPositions(items: CanvasItem[], selectedIds: string[]): Map<string, Position> {
    const positions = new Map<string, Position>();

    for (const item of items) {
        if (selectedIds.includes(item.id)) {
            positions.set(item.id, { ...item.position });
        }
    }

    return positions;
}
