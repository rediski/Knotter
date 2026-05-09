import type { Position } from '@/canvas/_core/_/canvas.types';

import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getNodesInSelectionBox } from '@/canvas/utils/nodes/getNodesInSelectionBox';

import { useItemsStore } from '@/canvas/store/useItemsStore';

export function selectItemsInSelectionBox(start: Position, end: Position) {
    const itemsState = useItemsStore.getState();

    const items = itemsState.items;
    const nodes = getNodes(items);

    const setSelectedItemIds = itemsState.setSelectedItemIds;

    const nodesInSelectionBox = getNodesInSelectionBox(nodes, start, end);

    setSelectedItemIds(nodesInSelectionBox);
}
