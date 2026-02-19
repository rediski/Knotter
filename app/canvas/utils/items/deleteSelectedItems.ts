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

    const deletedNodeIds = new Set(nodes.filter((node: Node) => idsToDelete.has(node.id)).map((node: Node) => node.id));

    const newItems = items.filter((item) => {
        if (idsToDelete.has(item.id)) return false;

        if (item.kind === 'edge') {
            const edge = item as Edge;

            if (deletedNodeIds.has(edge.from) || deletedNodeIds.has(edge.to)) {
                return false;
            }
        }

        return true;
    });

    setItems(newItems);

    setSelectedItemIds(selectedItemIds.filter((id) => !idsToDelete.has(id)));
    setSelectedEdgeIds(selectedEdgeIds.filter((id) => !idsToDelete.has(id)));
}
