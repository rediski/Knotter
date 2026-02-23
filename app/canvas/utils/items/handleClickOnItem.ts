import { useCanvasStore } from '@/canvas/store/canvasStore';

import { selectItems } from '@/canvas/utils/items/selectItems';
import { getNodeIdUnderCursor } from '@/canvas/utils/nodes/getNodeIdUnderCursor';
import { getEdgeIdUnderCursor } from '@/canvas/utils/edges/getEdgeIdUnderCursor';
import { createEdge } from '@/canvas/utils/edges/createEdge';

export function handleClickOnItem(e: MouseEvent, isCanvasUnderCursor: boolean) {
    if (e.button !== 0) return;

    const state = useCanvasStore.getState();

    const selectedItemIds = state.selectedItemIds;
    const selectedEdgeIds = state.selectedEdgeIds;

    const setSelectedItemIds = state.setSelectedItemIds;
    const setSelectedEdgeIds = state.setSelectedEdgeIds;

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
