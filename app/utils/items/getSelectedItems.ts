import type { CanvasItem } from '@/_core/_/canvas.types';
import { useItemsStore } from '@/store/useItemsStore';

export const getSelectedItems = (): CanvasItem[] => {
    const itemsState = useItemsStore.getState();

    const currentSceneId = itemsState.currentSceneId;
    const scenes = itemsState.scenes;
    const selectedItemIds = itemsState.selectedItemIds;

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const items = scene?.items ?? [];

    const selectedIdsSet = new Set(selectedItemIds);
    const selectedItems = items.filter((item) => selectedIdsSet.has(item.id));

    return selectedItems;
};

export const getSelectedItem = (): CanvasItem | null => {
    const selectedItems = getSelectedItems();

    return selectedItems[0] || null;
};
