import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';

export function initEdge() {
    const selectedItemIds = useItemsStore.getState().selectedItemIds;
    const setTempEdge = useCanvasStore.getState().setTempEdge;

    if (selectedItemIds.length === 0) return;

    return setTempEdge(selectedItemIds[0]);
}
