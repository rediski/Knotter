import { v4 as uuid } from 'uuid';

import type { Edge } from '@/canvas/_core/_/canvas.types';
import { useItemsStore } from '@/canvas/store/useItemsStore';

import { canAddItem } from '@/canvas/utils/items/canAddItems';
import { addToHistory } from '@/canvas/utils/history/historyManager';
import { getCurrentForegroundColor } from '@/canvas/utils/canvas/getCurrentForegroundColor';

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

    setItems(newItems);
    setTempEdge(null);
}
