import type { Position } from '@/_core/_/canvas.types';

import { useItemsStore } from '@/store/useItemsStore';
import { useCanvasStore } from '@/store/useCanvasStore';

import { snapPosition } from '@/utils/items/getSnappedPosition';

import { NODE_MOVE_MIN_STEP, NODE_MOVE_MAX_STEP } from '@/_core/_/canvas.constants';

function applyNodePositionUpdates(positionUpdates: Map<string, Position>) {
    const { currentSceneId, scenes, selectedItemIds } = useItemsStore.getState();
    const canvasState = useCanvasStore.getState();

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    const isMagnet = canvasState.isMagnet;
    const step = isMagnet ? NODE_MOVE_MAX_STEP : NODE_MOVE_MIN_STEP;

    const updatedItems = items.map((item) => {
        if (item.kind !== 'node') return item;
        if (!selectedItemIds.includes(item.id)) return item;

        const desiredPosition = positionUpdates.get(item.id);

        if (!desiredPosition) return item;

        const snappedPosition = snapPosition(desiredPosition, step);

        if (snappedPosition.x === item.position.x && snappedPosition.y === item.position.y) {
            return item;
        }

        return { ...item, position: snappedPosition };
    });

    if (scene) {
        const updatedScene = {
            ...scene,
            items: updatedItems,
            updatedAt: new Date(),
        };
        useItemsStore.setState({ scenes: { ...scenes, [currentSceneId]: updatedScene } });
    }
}

export function changeNodePosition(nodeId: string, newPosition: Position) {
    const updateMap = new Map([[nodeId, newPosition]]);
    applyNodePositionUpdates(updateMap);
}

export function changeNodePositions(updates: Array<{ nodeId: string; newPosition: Position }>) {
    const updateMap = new Map(updates.map((update) => [update.nodeId, update.newPosition]));
    applyNodePositionUpdates(updateMap);
}
