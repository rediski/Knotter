import type { Position, CanvasItem } from '@/canvas/_core/_/canvas.types';

import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';

import { snapPosition } from '@/canvas/utils/items/getSnappedPosition';
import { getNodes } from '@/canvas/utils/nodes/getNodes';

import { NODE_MOVE_MIN_STEP, NODE_MOVE_MAX_STEP } from '@/canvas/_core/_/canvas.constants';

export function moveNodes(dragDelta: Position, initialPositions: Map<string, Position>): CanvasItem[] {
    const itemsState = useItemsStore.getState();
    const canvasState = useCanvasStore.getState();

    const selectedItemIds = itemsState.selectedItemIds;
    const items = itemsState.items;
    const nodes = getNodes(items);

    const isMagnet = canvasState.isMagnet;

    const { x: dx, y: dy } = dragDelta;

    let changed = false;

    const updatedNodes = nodes.map((item) => {
        if (!selectedItemIds.includes(item.id)) return item;

        const initialPos = initialPositions.get(item.id);

        if (!initialPos) return item;

        const targetPosition = {
            x: initialPos.x + dx,
            y: initialPos.y + dy,
        };

        const step = isMagnet ? NODE_MOVE_MAX_STEP : NODE_MOVE_MIN_STEP;

        const newPosition = snapPosition(targetPosition, step);

        if (newPosition.x === item.position.x && newPosition.y === item.position.y) {
            return item;
        }

        changed = true;
        return { ...item, position: newPosition };
    });

    return changed ? updatedNodes : items;
}
