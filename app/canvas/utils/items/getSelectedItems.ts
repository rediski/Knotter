import { useCanvasStore } from '@/canvas/store/canvasStore';
import type { CanvasItem } from '@/canvas/_core/_/canvas.types';

export const getSelectedItems = (): CanvasItem[] => {
    const state = useCanvasStore.getState();

    const items = state.items;
    const selectedItemIds = state.selectedItemIds;

    const selectedIdsSet = new Set(selectedItemIds);
    const selectedItems = items.filter((item) => selectedIdsSet.has(item.id));

    return selectedItems;
};
