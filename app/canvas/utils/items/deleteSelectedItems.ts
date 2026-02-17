import type { Edge } from '@/canvas/_core/_/canvas.types';
import { useCanvasStore } from '@/canvas/store/canvasStore';

export function deleteSelectedItems() {
    const items = useCanvasStore.getState().items;
    const setItems = useCanvasStore.getState().setItems;
    const selectedItemIds = useCanvasStore.getState().selectedItemIds;

    const selectedIdsSet = new Set(selectedItemIds);

    const nodesToDelete = items.filter((item) => item.kind === 'node' && selectedIdsSet.has(item.id));

    const deletedNodeIds = new Set(nodesToDelete.map((node) => node.id));

    const newItems = items.filter((item) => {
        if (selectedIdsSet.has(item.id)) {
            return false;
        }

        if (item.kind === 'edge') {
            const edge = item as Edge;

            if (deletedNodeIds.has(edge.from) || deletedNodeIds.has(edge.to)) {
                return false;
            }
        }

        return true;
    });

    setItems(newItems);
}
