import { useItemsStore } from '@/canvas/store/useItemsStore';

export function selectAllItems() {
    const itemsStore = useItemsStore.getState();
    const items = itemsStore.items;
    const setSelectedItemIds = itemsStore.setSelectedItemIds;

    setSelectedItemIds(items.map((item) => item.id));
}
