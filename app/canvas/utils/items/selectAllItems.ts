import { useCanvasStore } from '@/canvas/store/canvasStore';

export function selectAllItems() {
    const items = useCanvasStore.getState().items;
    const setSelectedItemIds = useCanvasStore.getState().setSelectedItemIds;

    setSelectedItemIds(items.map((item) => item.id));
}
