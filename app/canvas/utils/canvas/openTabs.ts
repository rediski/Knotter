import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';

export const openTabs = (nodeIds: string | string[]) => {
    const setSelectedItemIds = useItemsStore.getState().setSelectedItemIds;

    const setSelectedTabId = useCanvasStore.getState().setSelectedTabId;
    const openedTabIds = useCanvasStore.getState().openedTabIds;
    const setOpenedTabIds = useCanvasStore.getState().setOpenedTabIds;

    const ids = Array.isArray(nodeIds) ? nodeIds : [nodeIds];

    const newOpenedIds = [...new Set([...openedTabIds, ...ids])];
    setOpenedTabIds(newOpenedIds);

    if (ids.length > 0) {
        const lastId = ids[ids.length - 1];
        setSelectedTabId(lastId);
        setSelectedItemIds(ids);
    }
};
