import type { Position } from '@/canvas/_core/_/canvas.types';

import { getSelectedItems } from '@/canvas/utils/items/getSelectedItems';
import { isMovableItem } from '@/canvas/utils/items/isMovableItem';

export function getSelectedItemsPositions(): Map<string, Position> {
    const positions = new Map<string, Position>();

    for (const item of getSelectedItems().filter(isMovableItem)) {
        positions.set(item.id, { ...item.position });
    }

    return positions;
}
