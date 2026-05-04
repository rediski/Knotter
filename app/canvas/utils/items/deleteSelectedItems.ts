import type { Node } from '@/canvas/_core/_/canvas.types';
import { useItemsStore } from '@/canvas/store/useItemsStore';

import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { addToHistory } from '@/canvas/utils/history/historyManager';

export function deleteSelectedItems() {
    const itemsState = useItemsStore.getState();

    const selectedItemIds = itemsState.selectedItemIds;
    const selectedEdgeIds = itemsState.selectedEdgeIds;

    const idsToDelete = [...selectedItemIds, ...selectedEdgeIds];

    if (idsToDelete.length === 0) return;

    deleteSelectedItemsById(idsToDelete);
}

export function deleteSelectedItemsById(itemIds: string | string[]) {
    const itemsState = useItemsStore.getState();

    const items = itemsState.items;
    const setItems = itemsState.setItems;
    const selectedItemIds = itemsState.selectedItemIds;
    const selectedEdgeIds = itemsState.selectedEdgeIds;
    const setSelectedItemIds = itemsState.setSelectedItemIds;
    const setSelectedEdgeIds = itemsState.setSelectedEdgeIds;

    const idsToDelete = new Set(Array.isArray(itemIds) ? itemIds : [itemIds]);

    const nodes = getNodes(items);
    const deletedNodeIds = new Set(nodes.filter((node: Node) => idsToDelete.has(node.id)).map((node) => node.id));

    const newItems = items
        .map((item) => {
            if (item.kind !== 'node') return item;

            const newEdges = item.edges.filter((edge) => !idsToDelete.has(edge.id) && !deletedNodeIds.has(edge.to));

            return {
                ...item,
                edges: newEdges,
            };
        })
        .filter((item) => !idsToDelete.has(item.id));

    addToHistory({
        type: 'DELETE_ITEMS',
        ids: Array.from(idsToDelete),
    });

    setItems(newItems);

    setSelectedItemIds(selectedItemIds.filter((id) => !idsToDelete.has(id)));
    setSelectedEdgeIds(selectedEdgeIds.filter((id) => !idsToDelete.has(id)));
}
