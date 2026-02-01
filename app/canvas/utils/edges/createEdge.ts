import type { Node } from '@/canvas/_core/_/canvas.types';
import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { useCanvasStore } from '@/canvas/store/canvasStore';

export function createEdge() {
    const items = useCanvasStore.getState().items;
    const selectedItemIds = useCanvasStore.getState().selectedItemIds;
    const setTempEdge = useCanvasStore.getState().setTempEdge;

    if (!setTempEdge || selectedItemIds.length === 0) return;

    const nodes = getNodes(items);
    const fromNode = nodes.find((node: Node) => node.id === selectedItemIds[0]);

    if (!fromNode) return;

    setTempEdge({ from: fromNode.id, toPos: { ...fromNode.position } });
}
