import { v4 as uuid } from 'uuid';

import type { Node } from '@/canvas/_core/_/canvas.types';
import { useItemsStore } from '@/canvas/store/useItemsStore';

import { canAddItem } from '@/canvas/utils/items/canAddItems';
import { addToHistory } from '@/canvas/utils/history/historyManager';

export function createEdge(clickedNodeId: string) {
    if (!canAddItem()) return null;

    const itemsState = useItemsStore.getState();

    const tempEdge = itemsState.tempEdge;
    const setTempEdge = itemsState.setTempEdge;

    const items = itemsState.items;
    const setItems = itemsState.setItems;

    if (!tempEdge || !clickedNodeId || tempEdge === clickedNodeId) {
        return null;
    }

    let updatedNode: Node | null = null;

    const newItems = items.map((item) => {
        if (item.kind !== 'node') return item;
        if (item.id !== tempEdge) return item;

        if (item.edges.some((edge) => edge.to === clickedNodeId)) {
            return item;
        }

        updatedNode = {
            ...item,
            edges: [
                ...item.edges,
                {
                    id: uuid(),
                    to: clickedNodeId,
                },
            ],
        };

        return updatedNode;
    });

    if (updatedNode) {
        addToHistory({
            type: 'UPDATE_ITEMS',
            items: [structuredClone(updatedNode)],
        });
    }

    setItems(newItems);

    setTempEdge(null);
}
