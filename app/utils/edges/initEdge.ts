import { useItemsStore } from '@/store/useItemsStore';

export function initEdge() {
    const itemsState = useItemsStore.getState();

    const selectedItemIds = itemsState.selectedItemIds;
    const setTempEdge = itemsState.setTempEdge;

    if (selectedItemIds.length === 0) return;

    return setTempEdge(selectedItemIds[0]);
}
