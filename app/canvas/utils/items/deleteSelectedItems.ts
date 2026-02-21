import type { Edge, Node } from '@/canvas/_core/_/canvas.types';
import { useCanvasStore } from '@/canvas/store/canvasStore';
import { getNodes } from '@/canvas/utils/nodes/getNodes';

export function deleteSelectedItems() {
    const selectedItemIds = useCanvasStore.getState().selectedItemIds;
    const selectedEdgeIds = useCanvasStore.getState().selectedEdgeIds;

    const idsToDelete = [...selectedItemIds, ...selectedEdgeIds];

    if (idsToDelete.length === 0) return;

    deleteSelectedItemsById(idsToDelete);
}

export function deleteSelectedItemsById(itemIds: string | string[]) {
    const items = useCanvasStore.getState().items;
    const setItems = useCanvasStore.getState().setItems;
    const selectedItemIds = useCanvasStore.getState().selectedItemIds;
    const selectedEdgeIds = useCanvasStore.getState().selectedEdgeIds;
    const setSelectedItemIds = useCanvasStore.getState().setSelectedItemIds;
    const setSelectedEdgeIds = useCanvasStore.getState().setSelectedEdgeIds;

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

    setItems(newItems);

    setSelectedItemIds(selectedItemIds.filter((id) => !idsToDelete.has(id)));
    setSelectedEdgeIds(selectedEdgeIds.filter((id) => !idsToDelete.has(id)));
}
