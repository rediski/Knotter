import type { Edge } from '@/canvas/_core/_/canvas.types';
import { v4 as uuid } from 'uuid';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import { getEdges } from '@/canvas/utils/edges/getEdges';
import { canAddItem } from '@/canvas/utils/items/canAddItem';
import { generateUniqueName } from '@/canvas/utils/items/generateUniqueName';

export function createEdge(clickedNodeId: string) {
    if (!canAddItem()) return null;

    const items = useCanvasStore.getState().items;
    const setItems = useCanvasStore.getState().setItems;
    const tempEdge = useCanvasStore.getState().tempEdge;
    const setTempEdge = useCanvasStore.getState().setTempEdge;

    const isSameNode = tempEdge === clickedNodeId;

    if (!tempEdge || !clickedNodeId || isSameNode) {
        return null;
    }

    const edges = getEdges(items);

    const baseName = 'Связь';

    const name = generateUniqueName(
        baseName,
        edges.map((edge) => edge.name),
    );

    const newEdge: Edge = {
        id: uuid(),
        name,
        kind: 'edge',
        from: tempEdge,
        to: clickedNodeId,
    };

    setItems([...items, newEdge]);
    setTempEdge(null);
}
