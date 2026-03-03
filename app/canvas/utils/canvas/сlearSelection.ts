import { useItemsStore } from '@/canvas/store/useItemsStore';

export const clearSelection = () => {
    const itemsState = useItemsStore.getState();

    const hasTempEdge = itemsState.tempEdge !== null;
    const hasSelectedItems = itemsState.selectedItemIds.length > 0;
    const hasSelectedEdges = itemsState.selectedEdgeIds.length > 0;
    const setTempEdge = itemsState.setTempEdge;
    const setSelectedItemIds = itemsState.setSelectedItemIds;
    const setSelectedEdgeIds = itemsState.setSelectedEdgeIds;

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
