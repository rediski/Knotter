import { v4 as uuid } from 'uuid';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import { canAddItem } from '@/canvas/utils/items/canAddItem';
import type { Node } from '@/canvas/_core/_/canvas.types';

export function createEdge(clickedNodeId: string) {
    if (!canAddItem()) return null;

    const { items, setItems, tempEdge: fromNodeId, setTempEdge } = useCanvasStore.getState();

    if (!fromNodeId || !clickedNodeId || fromNodeId === clickedNodeId) {
        return null;
    }

    setItems(
        items.map((item) => {
            if (item.kind !== 'node') return item;
            if (item.id !== fromNodeId) return item;

            if (item.edges.some((e) => e.to === clickedNodeId)) {
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
