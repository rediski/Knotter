import { useItemsStore } from '@/canvas/store/useItemsStore';
import type { CanvasItem } from '@/canvas/_core/_/canvas.types';

export const getSelectedItems = (): CanvasItem[] => {
    const itemsState = useItemsStore.getState();

    const items = itemsState.items;
    const selectedItemIds = itemsState.selectedItemIds;

    const selectedIdsSet = new Set(selectedItemIds);
    const selectedItems = items.filter((item) => selectedIdsSet.has(item.id));

    return selectedItems;
};
