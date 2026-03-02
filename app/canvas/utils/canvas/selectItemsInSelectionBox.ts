import type { Position } from '@/canvas/_core/_/canvas.types';
import { getItemsInSelectionBox } from '@/canvas/utils/items/getItemsInSelectionBox';

import { useItemsStore } from '@/canvas/store/useItemsStore';

export function selectItemsInSelectionBox(start: Position, end: Position) {
    const items = useItemsStore.getState().items;
    const setSelectedItemIds = useItemsStore.getState().setSelectedItemIds;
    const setSelectedEdgeIds = useItemsStore.getState().setSelectedEdgeIds;

    const selected = getItemsInSelectionBox(items, start, end);

    setSelectedItemIds(selected);

    if (selected.length === 0) {
        setSelectedEdgeIds([]);
    }
}
