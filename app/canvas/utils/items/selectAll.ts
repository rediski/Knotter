import { useCanvasStore } from '@/canvas/store/canvasStore';

export function selectAll() {
    const items = useCanvasStore.getState().items;
    const setSelectedItemIds = useCanvasStore.getState().setSelectedItemIds;

    setSelectedItemIds(items.map((item) => item.id));
}
