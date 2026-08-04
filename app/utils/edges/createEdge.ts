import { v4 as uuid } from 'uuid';

import type { Edge } from '@/_core/_/canvas.types';
import { useItemsStore } from '@/store/useItemsStore';

import { addToHistory } from '@/utils/scene/historyManager';
import { canAddItem } from '@/utils/items/canAddItems';
import { generateUniqueName } from '@/utils/items/generateUniqueName';
import { getEdges } from '@/utils/edges/getEdges';

export function createEdge(clickedNodeId: string) {
    if (!canAddItem()) return null;

    const { currentSceneId, scenes, tempEdge, setTempEdge } = useItemsStore.getState();

    if (!currentSceneId) return null;

    const scene = scenes[currentSceneId];

    if (!scene) return null;

    const items = scene.items;
    const edges = getEdges(items);

    if (!tempEdge || !clickedNodeId || tempEdge === clickedNodeId) {
        return null;
    }

    const baseName = 'Связь';

    const name = generateUniqueName(
        baseName,
        edges.map((edge) => edge.name),
    );

    const newEdge: Edge = {
        kind: 'edge',
        id: uuid(),
        name,
        from: tempEdge,
        to: clickedNodeId,
        color: null,
    };

    const newItems = [...items, newEdge];

    const updatedScene = {
        ...scene,
        items: newItems,
        updatedAt: new Date(),
    };

    useItemsStore.setState({ scenes: { ...scenes, [currentSceneId]: updatedScene } });

    setTempEdge(null);

    addToHistory({
        type: 'ADD_ITEMS',
        items: [structuredClone(newEdge)],
        timestamp: Date.now(),
    });
}
