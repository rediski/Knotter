import { useItemsStore } from '@/canvas/store/useItemsStore';

export const clearSelection = () => {
    const itemsState = useItemsStore.getState();

    const hasTempEdge = itemsState.tempEdge !== null;
    const hasSelectedItems = itemsState.selectedItemIds.length > 0;

    const setTempEdge = itemsState.setTempEdge;
    const setSelectedItemIds = itemsState.setSelectedItemIds;

    if (hasSelectedItems) {
        setSelectedItemIds([]);
    }

    if (hasTempEdge) {
        setTempEdge(null);
    }
};
