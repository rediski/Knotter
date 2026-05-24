import { v4 as uuid } from 'uuid';

import type { Edge } from '@/_core/_/canvas.types';
import { useItemsStore } from '@/store/useItemsStore';

import { canAddItem } from '@/utils/items/canAddItems';
import { addToHistory } from '@/utils/history/historyManager';
import { getCurrentForegroundColor } from '@/utils/canvas/getCurrentForegroundColor';

export function createEdge(clickedNodeId: string) {
    if (!canAddItem()) return null;

    const { currentSceneId, scenes, tempEdge, setTempEdge } = useItemsStore.getState();

    if (!currentSceneId) return null;

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    if (!tempEdge || !clickedNodeId || tempEdge === clickedNodeId) {
        return null;
    }

    const newEdge: Edge = {
        kind: 'edge',
        id: uuid(),
        from: tempEdge,
        to: clickedNodeId,
        color: getCurrentForegroundColor(),
    };

    const newItems = [...items, newEdge];

    addToHistory({
        type: 'ADD_ITEMS',
        items: [structuredClone(newEdge)],
    });

    if (scene) {
        const updatedScene = {
            ...scene,
            items: newItems,
            updatedAt: new Date(),
        };
        useItemsStore.setState({ scenes: { ...scenes, [currentSceneId]: updatedScene } });
    }

    setTempEdge(null);
}
