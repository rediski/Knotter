import { useItemsStore } from '@/canvas/store/useItemsStore';

export function selectAllEdges() {
    const itemsState = useItemsStore.getState();

    const items = itemsState.items;
    const setSelectedItemIds = itemsState.setSelectedItemIds;

    const edgeIds = items.filter((item) => item.kind === 'edge').map((edge) => edge.id);

    setSelectedItemIds(edgeIds);
}
