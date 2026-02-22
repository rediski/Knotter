import { useCanvasStore } from '@/canvas/store/canvasStore';
import { selectAllEdges } from '@/canvas/utils/edges/selectAllEdges';

export function selectAllItems() {
    const items = useCanvasStore.getState().items;
    const setSelectedItemIds = useCanvasStore.getState().setSelectedItemIds;

    selectAllEdges();
    setSelectedItemIds(items.map((item) => item.id));
}
