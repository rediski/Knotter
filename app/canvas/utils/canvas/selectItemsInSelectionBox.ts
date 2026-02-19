import { useCanvasStore } from '@/canvas/store/canvasStore';
import { getItemsInSelectionBox } from '@/canvas/utils/items/getItemsInSelectionBox';
import type { Position } from '@/canvas/_core/_/canvas.types';

export function selectItemsInSelectionBox(start: Position, end: Position) {
    const items = useCanvasStore.getState().items;
    const setSelectedItemIds = useCanvasStore.getState().setSelectedItemIds;
    const setSelectedEdgeIds = useCanvasStore.getState().setSelectedEdgeIds;

    const selected = getItemsInSelectionBox(items, start, end);

    setSelectedItemIds(selected);

    if (selected.length === 0) {
        setSelectedEdgeIds([]);
    }
}
