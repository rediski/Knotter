import { useItemsStore } from '@/store/useItemsStore';

import { getNodes } from '@/utils/nodes/getNodes';
import { getEdges } from '@/utils/edges/getEdges';
import { addToHistory } from '@/utils/scene/historyManager';

export function deleteSelectedItems() {
    const { currentSceneId, selectedItemIds } = useItemsStore.getState();

    if (!currentSceneId) return;

    const idsToDelete = [...selectedItemIds];

    if (idsToDelete.length === 0) return;

    deleteSelectedItemsById(idsToDelete);
}

export function deleteSelectedItemsById(itemIds: string | string[]) {
    const { currentSceneId, scenes, selectedItemIds, setSelectedItemIds, setScenes } = useItemsStore.getState();

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    const idsToDelete = new Set(Array.isArray(itemIds) ? itemIds : [itemIds]);

    const nodes = getNodes(items);
    const deletedNodeIds = new Set(nodes.filter((node) => idsToDelete.has(node.id)).map((node) => node.id));

    const edges = getEdges(items);
    const affectedEdgeIds = new Set(
        edges
            .filter((edge) => deletedNodeIds.has(edge.from) || deletedNodeIds.has(edge.to) || idsToDelete.has(edge.id))
            .map((edge) => edge.id),
    );

    const allIdsToDelete = new Set([...idsToDelete, ...affectedEdgeIds]);

    const deletedItems = items.filter((item) => allIdsToDelete.has(item.id));

    if (deletedItems.length === 0) {
        return;
    }

    const newItems = items.filter((item) => !allIdsToDelete.has(item.id));

    if (scene) {
        const updatedScene = {
            ...scene,
            items: newItems,
            updatedAt: new Date(),
        };

        setScenes({
            ...scenes,
            [currentSceneId]: updatedScene,
        });
    }

    setSelectedItemIds(selectedItemIds.filter((id) => !allIdsToDelete.has(id)));

    addToHistory({
        type: 'DELETE_ITEMS',
        items: deletedItems,
        timestamp: Date.now(),
    });
}
