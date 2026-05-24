import type { Position } from '@/_core/_/canvas.types';

import { getNodes } from '@/utils/nodes/getNodes';
import { getNodesInSelectionBox } from '@/utils/nodes/getNodesInSelectionBox';

import { useItemsStore } from '@/store/useItemsStore';

export function selectItemsInSelectionBox(start: Position, end: Position) {
    const { currentSceneId, scenes, setSelectedItemIds } = useItemsStore.getState();

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const items = scene?.items ?? [];
    const nodes = getNodes(items);

    const nodesInSelectionBox = getNodesInSelectionBox(nodes, start, end);

    setSelectedItemIds(nodesInSelectionBox);
}
