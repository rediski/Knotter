import { useCanvasStore } from '@/canvas/store/useCanvasStore';

import { selectItems } from '@/canvas/utils/items/selectItems';
import { getNodeIdUnderCursor } from '@/canvas/utils/nodes/getNodeIdUnderCursor';
import { getEdgeIdUnderCursor } from '@/canvas/utils/edges/getEdgeIdUnderCursor';
import { createEdge } from '@/canvas/utils/edges/createEdge';
import { useItemsStore } from '@/canvas/store/useItemsStore';

export function handleClickOnItem(e: MouseEvent, isCanvasUnderCursor: boolean) {
    if (e.button !== 0) return;

    const itemsState = useItemsStore.getState();

    const selectedItemIds = itemsState.selectedItemIds;
    const selectedEdgeIds = itemsState.selectedEdgeIds;

    const setSelectedItemIds = itemsState.setSelectedItemIds;
    const setSelectedEdgeIds = itemsState.setSelectedEdgeIds;

    const point = { x: e.clientX, y: e.clientY };
    const isMultiSelect = e.ctrlKey || e.metaKey || e.shiftKey;

    const clickedNodeId = getNodeIdUnderCursor(point);
    const clickedEdgeId = getEdgeIdUnderCursor(point);

    if (clickedEdgeId) {
        if (isMultiSelect) {
            if (selectedEdgeIds.includes(clickedEdgeId)) {
                setSelectedEdgeIds(selectedEdgeIds.filter((id) => id !== clickedEdgeId));
                return;
            }

            setSelectedEdgeIds([...selectedEdgeIds, clickedEdgeId]);
            return;
        }

        setSelectedEdgeIds([clickedEdgeId]);
        setSelectedItemIds([]);
        return;
    }

    const itemId = clickedNodeId;

    if (!itemId) {
        if (!isMultiSelect && isCanvasUnderCursor) {
            setSelectedItemIds([]);
            setSelectedEdgeIds([]);
        }

        return;
    }

    if (!selectedItemIds.includes(itemId)) {
        const newSelectedIds = selectItems({ itemId, event: e });
        setSelectedItemIds(newSelectedIds);
    }

    if (clickedNodeId) {
        createEdge(clickedNodeId);
    }
}
