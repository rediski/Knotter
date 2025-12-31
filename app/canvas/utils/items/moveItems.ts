import type { Position, CanvasItem } from '@/canvas/canvas.types';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { NODE_MOVE_MIN_STEP, NODE_MOVE_MAX_STEP } from '@/canvas/canvas.constants';

export function moveItems(dragDelta: Position, initialPositions: Map<string, Position>): CanvasItem[] {
    const selectedItemIds = useCanvasStore.getState().selectedItemIds;
    const items = useCanvasStore.getState().items;
    const isMagnet = useCanvasStore.getState().isMagnet;

    const { x: dx, y: dy } = dragDelta;

    let changed = false;

    const updatedItems = items.map((item) => {
        if (!selectedItemIds.includes(item.id)) return item;

        const initialPos = initialPositions.get(item.id);

        if (!initialPos) return item;

        const step = isMagnet ? NODE_MOVE_MAX_STEP : NODE_MOVE_MIN_STEP;

        const newX = Math.round((initialPos.x + dx) / step) * step;
        const newY = Math.round((initialPos.y + dy) / step) * step;

        if (newX === item.position.x && newY === item.position.y) {
            return item;
        }

        changed = true;

        return {
            ...item,
            position: { x: newX, y: newY },
        };
    });

    return changed ? updatedItems : items;
}
