import { Position } from '@/canvas/_core/_/canvas.types';
import { getSelectedItems } from '@/canvas/utils/items/getSelectedItems';

export function getSelectedItemsPositions(): Map<string, Position> {
    const positions = new Map<string, Position>();

    for (const item of getSelectedItems()) {
        positions.set(item.id, { ...item.position });
    }

    return positions;
}
