import { v4 as uuid } from 'uuid';

import { canAddItem } from '@/canvas/utils/items/canAddItem';
import type { Node } from '@/canvas/_core/_/canvas.types';

import { useItemsStore } from '@/canvas/store/useItemsStore';

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

    setItems(
        items.map((item) => {
            if (item.kind !== 'node') return item;
            if (item.id !== tempEdge) return item;

            if (item.edges.some((edge) => edge.to === clickedNodeId)) {
                return item;
            }

            return {
                ...item,
                edges: [
                    ...item.edges,
                    {
                        id: uuid(),
                        to: clickedNodeId,
                    },
                ],
            } satisfies Node;
        }),
    );

    setTempEdge(null);
}
