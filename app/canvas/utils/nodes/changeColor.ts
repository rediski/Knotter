import { useItemsStore } from '@/canvas/store/useItemsStore';

export function changeColor(newColor: string) {
    const itemsStore = useItemsStore.getState();

    const items = itemsStore.items;
    const setItems = itemsStore.setItems;
    const selectedItemIds = itemsStore.selectedItemIds;

    const updatedItems = items.map((item) => {
        if (item.kind === 'node' && selectedItemIds.includes(item.id)) {
            return { ...item, color: newColor };
        }

        return item;
    });

    setItems(updatedItems);
}
