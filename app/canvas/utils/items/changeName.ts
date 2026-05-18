import { useItemsStore } from '@/canvas/store/useItemsStore';

export function changeName(newName: string) {
    const itemsStore = useItemsStore.getState();

    const items = itemsStore.items;
    const setItems = itemsStore.setItems;
    const selectedItemIds = itemsStore.selectedItemIds;

    const updatedItems = items.map((item) => {
        if (selectedItemIds.includes(item.id)) {
            return { ...item, name: newName };
        }

        return item;
    });

    setItems(updatedItems);
}
