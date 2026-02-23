import { useCanvasStore } from '@/canvas/store/canvasStore';

import { selectItems } from '@/canvas/utils/items/selectItems';
import { getNodeIdUnderCursor } from '@/canvas/utils/nodes/getNodeIdUnderCursor';
import { getTextIdUnderCursor } from '@/canvas/utils/texts/getTextIdUnderCursor';
import { getEdgeIdUnderCursor } from '@/canvas/utils/edges/getEdgeIdUnderCursor';
import { getTextById } from '@/canvas/utils/texts/getTextById';
import { createEdge } from '@/canvas/utils/edges/createEdge';

export function handleClickOnItem(e: MouseEvent) {
    if (e.button !== 0) return;

    const state = useCanvasStore.getState();

    const items = state.items;
    const selectedItemIds = state.selectedItemIds;
    const selectedEdgeIds = state.selectedEdgeIds;

    const setSelectedItemIds = state.setSelectedItemIds;
    const setSelectedEdgeIds = state.setSelectedEdgeIds;

    const point = { x: e.clientX, y: e.clientY };
    const isMultiSelect = e.ctrlKey || e.metaKey || e.shiftKey;

    const clickedNodeId = getNodeIdUnderCursor(point);
    const clickedEdgeId = getEdgeIdUnderCursor(point);
    const clickedTextId = getTextIdUnderCursor(point);

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

    const itemId = clickedNodeId || clickedTextId;

    if (!itemId) {
        if (!isMultiSelect) {
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

    if (clickedTextId) {
        const textItem = getTextById(items, clickedTextId);
        if (textItem?.isEditing) return;
    }
}
