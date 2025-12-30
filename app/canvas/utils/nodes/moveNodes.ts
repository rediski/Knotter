import type { Position, CanvasItem } from '@/canvas/canvas.types';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { NODE_MOVE_MIN_STEP, NODE_MOVE_MAX_STEP } from '@/canvas/canvas.constants';

export function moveNodes(dragDelta: Position, initialPositions: Map<string, Position>): CanvasItem[] {
    const selectedItemIds = useCanvasStore.getState().selectedItemIds;
    const items = useCanvasStore.getState().items;
    const isMagnet = useCanvasStore.getState().isMagnet;

    const { x: dx, y: dy } = dragDelta;

    let changed = false;

    const updatedNodes = items.map((node) => {
        if (!selectedItemIds.includes(node.id)) return node;

        const initialPos = initialPositions.get(node.id);

        if (!initialPos) return node;

        const step = isMagnet ? NODE_MOVE_MAX_STEP : NODE_MOVE_MIN_STEP;

        const newX = Math.round((initialPos.x + dx) / step) * step;
        const newY = Math.round((initialPos.y + dy) / step) * step;

        if (newX === node.position.x && newY === node.position.y) {
            return node;
        }

        changed = true;

        return {
            ...node,
            position: { x: newX, y: newY },
        };
    });

    return changed ? updatedNodes : items;
}
