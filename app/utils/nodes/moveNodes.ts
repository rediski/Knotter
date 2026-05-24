import type { Position, CanvasItem } from '@/_core/_/canvas.types';

import { useCanvasStore } from '@/store/useCanvasStore';
import { useItemsStore } from '@/store/useItemsStore';

import { snapPosition } from '@/utils/items/getSnappedPosition';

import { NODE_MOVE_MIN_STEP, NODE_MOVE_MAX_STEP } from '@/_core/_/canvas.constants';

export function moveNodes(dragDelta: Position, initialPositions: Map<string, Position>): CanvasItem[] {
    const { currentSceneId, scenes, selectedItemIds } = useItemsStore.getState();
    const canvasState = useCanvasStore.getState();

    if (!currentSceneId) return [];

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    const isMagnet = canvasState.isMagnet;

    const { x: dx, y: dy } = dragDelta;

    let hasChanges = false;

    const updatedItems = items.map((item) => {
        if (item.kind !== 'node') return item;
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

        hasChanges = true;
        return { ...item, position: newPosition };
    });

    return hasChanges ? updatedItems : items;
}
