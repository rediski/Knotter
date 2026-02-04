import type { Node } from '@/canvas/_core/_/canvas.types';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import { getNodes } from '@/canvas/utils/nodes/getNodes';

export function createEdge(clickedNodeId: string) {
    const items = useCanvasStore.getState().items;
    const setItems = useCanvasStore.getState().setItems;
    const tempEdge = useCanvasStore.getState().tempEdge;

    if (!tempEdge || !clickedNodeId || tempEdge === clickedNodeId) return;

    const nodes = getNodes(items);

    const addEdgeTo = (node: Node, toId: string) => ({
        ...node,
        edgeTo: node.edgeTo?.includes(toId) ? node.edgeTo : [...(node.edgeTo ?? []), toId],
    });

    const addEdgeFrom = (node: Node, fromId: string) => ({
        ...node,
        edgeFrom: node.edgeFrom?.includes(fromId) ? node.edgeFrom : [...(node.edgeFrom ?? []), fromId],
    });

    setItems(
        nodes.map((node) => {
            if (node.id === tempEdge) return addEdgeTo(node, clickedNodeId);
            if (node.id === clickedNodeId) return addEdgeFrom(node, tempEdge);
            return node;
        }),
    );
}
