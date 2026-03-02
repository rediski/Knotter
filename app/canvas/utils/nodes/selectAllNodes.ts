import { useItemsStore } from '@/canvas/store/useItemsStore';

export function selectAllNodes() {
    const itemsState = useItemsStore.getState();

    const items = itemsState.items;
    const setSelectedItemIds = itemsState.setSelectedItemIds;

    setSelectedItemIds(items.filter((item) => item.kind === 'node').map((node) => node.id));
}
