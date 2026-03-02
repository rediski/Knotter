import { useItemsStore } from '@/canvas/store/useItemsStore';
import { useCanvasStore } from '@/canvas/store/useCanvasStore';

export const clearSelection = () => {
    const hasSelectedItems = useItemsStore.getState().selectedItemIds.length > 0;
    const hasSelectedEdges = useItemsStore.getState().selectedEdgeIds.length > 0;
    const setSelectedItemIds = useItemsStore.getState().setSelectedItemIds;
    const setSelectedEdgeIds = useItemsStore.getState().setSelectedEdgeIds;

    const hasTempEdge = useCanvasStore.getState().tempEdge !== null;
    const setTempEdge = useCanvasStore.getState().setTempEdge;

    if (hasSelectedItems) {
        setSelectedItemIds([]);
    }

    if (hasSelectedEdges) {
        setSelectedEdgeIds([]);
    }

    if (hasTempEdge) {
        setTempEdge(null);
    }
};
