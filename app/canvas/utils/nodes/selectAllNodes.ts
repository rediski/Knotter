import { useCanvasStore } from '@/canvas/store/canvasStore';

export function selectAllNodes() {
    const items = useCanvasStore.getState().items;
    const setSelectedItemIds = useCanvasStore.getState().setSelectedItemIds;

    setSelectedItemIds(items.filter((item) => item.kind === 'node').map((node) => node.id));
}
