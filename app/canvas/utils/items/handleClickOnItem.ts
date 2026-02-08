import { useCanvasStore } from '@/canvas/store/canvasStore';

import { selectItems } from '@/canvas/utils/items/selectItems';
import { getNodeIdUnderCursor } from '@/canvas/utils/nodes/getNodeIdUnderCursor';
import { createEdge } from '@/canvas/utils/edges/createEdge';
import { getTextIdUnderCursor } from '@/canvas/utils/texts/getTextIdUnderCursor';
import { getTextById } from '@/canvas/utils/texts/getTextById';

export function handleClickOnItem(e: MouseEvent) {
    const items = useCanvasStore.getState().items;
    const setSelectedItemIds = useCanvasStore.getState().setSelectedItemIds;
    const selectedItemIds = useCanvasStore.getState().selectedItemIds;

    const clickedNodeId = getNodeIdUnderCursor({ x: e.clientX, y: e.clientY });
    const clickedTextId = getTextIdUnderCursor({ x: e.clientX, y: e.clientY });
    const clickedItemId = clickedNodeId || clickedTextId;

    if (clickedItemId && selectedItemIds.includes(clickedItemId)) {
        return;
    }

    if (clickedItemId) {
        const newSelectedIds = selectItems({ itemId: clickedItemId, event: e });
        setSelectedItemIds(newSelectedIds);
    }

    if (!clickedItemId && !(e.ctrlKey || e.metaKey || e.shiftKey)) {
        setSelectedItemIds([]);
    }

    if (clickedNodeId) {
        createEdge(clickedNodeId);
    }

    if (clickedTextId) {
        const textItem = getTextById(items, clickedTextId);
        if (textItem?.isEditing) return;
    }
}
