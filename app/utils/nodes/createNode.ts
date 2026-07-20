import type { Node } from '@/_core/_/canvas.types';
import { v4 as uuidv4 } from 'uuid';

import { useItemsStore } from '@/store/useItemsStore';

import { getCurrentForegroundColor } from '@/utils/canvas/getCurrentForegroundColor';
import { getSnappedPosition } from '@/utils/items/getSnappedPosition';
import { canAddItem } from '@/utils/items/canAddItems';
import { generateUniqueName } from '@/utils/items/generateUniqueName';

import { getNodes } from '@/utils/nodes/getNodes';
import { addToHistory } from '@/utils/history/historyManager';

export function createNode(): Node | null {
    if (!canAddItem()) return null;

    const itemsState = useItemsStore.getState();

    const currentSceneId = itemsState.currentSceneId;
    const scenes = itemsState.scenes;
    const setScenes = itemsState.setScenes;
    const setSelectedItemIds = itemsState.setSelectedItemIds;

    if (!currentSceneId || !scenes[currentSceneId]) return null;

    const scene = scenes[currentSceneId];
    const nodes = getNodes(scene.items);
    const position = getSnappedPosition();

    const x = Math.round(position.x ?? 0);
    const y = Math.round(position.y ?? 0);

    const baseName = 'Узел';

    const name = generateUniqueName(
        baseName,
        nodes.map((node) => node.name),
    );

    const node: Node = {
        kind: 'node',
        id: uuidv4(),
        sceneId: currentSceneId,
        name,
        description: '',
        shapeType: 'point',
        color: getCurrentForegroundColor(),
        position: { x, y },
        parameters: [],
    };

    addToHistory({
        type: 'ADD_ITEMS',
        items: [structuredClone(node)],
    });

    const updatedItems = [...scene.items, node];
    const updatedScene: typeof scene = {
        ...scene,
        items: updatedItems,
        updatedAt: new Date(),
    };

    setScenes({ ...scenes, [currentSceneId]: updatedScene });
    setSelectedItemIds([node.id]);

    return node;
}
