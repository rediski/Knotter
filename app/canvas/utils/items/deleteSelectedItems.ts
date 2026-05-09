import { useItemsStore } from '@/canvas/store/useItemsStore';

import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getEdges } from '@/canvas/utils/edges/getEdges';
import { addToHistory } from '@/canvas/utils/history/historyManager';

export function deleteSelectedItems() {
    const itemsState = useItemsStore.getState();
    const selectedItemIds = itemsState.selectedItemIds;
    const idsToDelete = [...selectedItemIds];

    if (idsToDelete.length === 0) return;

    deleteSelectedItemsById(idsToDelete);
}

export function deleteSelectedItemsById(itemIds: string | string[]) {
    const itemsState = useItemsStore.getState();

    const items = itemsState.items;
    const setItems = itemsState.setItems;
    const selectedItemIds = itemsState.selectedItemIds;
    const setSelectedItemIds = itemsState.setSelectedItemIds;

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

    const newItems = items.filter((item) => !allIdsToDelete.has(item.id));

    addToHistory({
        type: 'DELETE_ITEMS',
        ids: Array.from(allIdsToDelete),
    });

    setItems(newItems);

    setSelectedItemIds(selectedItemIds.filter((id) => !allIdsToDelete.has(id)));
}
