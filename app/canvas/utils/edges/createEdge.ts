import { useCanvasStore } from '@/canvas/store/canvasStore';

export function createEdge() {
    const selectedItemIds = useCanvasStore.getState().selectedItemIds;
    const setTempEdge = useCanvasStore.getState().setTempEdge;

    if (selectedItemIds.length === 0) return;

    return setTempEdge(selectedItemIds[0]);
}
