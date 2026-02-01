import { useCanvasStore } from '@/canvas/store/canvasStore';

export function selectAllTexts() {
    const items = useCanvasStore.getState().items;
    const setSelectedItemIds = useCanvasStore.getState().setSelectedItemIds;

    setSelectedItemIds(items.filter((item) => item.kind === 'text').map((text) => text.id));
}
