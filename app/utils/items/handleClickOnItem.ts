import { selectItems } from '@/utils/items/selectItems';
import { getNodeIdUnderCursor } from '@/utils/nodes/getNodeIdUnderCursor';
import { getEdgeIdUnderCursor } from '@/utils/edges/getEdgeIdUnderCursor';
import { createEdge } from '@/utils/edges/createEdge';
import { useItemsStore } from '@/store/useItemsStore';

export function handleClickOnItem(e: MouseEvent, isCanvasUnderCursor: boolean) {
    if (e.button !== 0) return;

    const itemsState = useItemsStore.getState();

    const selectedItemIds = itemsState.selectedItemIds;
    const setSelectedItemIds = itemsState.setSelectedItemIds;

    const point = { x: e.clientX, y: e.clientY };
    const isMultiSelect = e.ctrlKey || e.metaKey || e.shiftKey;

    const nodeIdUnderCursor = getNodeIdUnderCursor(point);
    const edgeIdUnderCursor = getEdgeIdUnderCursor(point);

    if (edgeIdUnderCursor) {
        if (isMultiSelect) {
            if (selectedItemIds.includes(edgeIdUnderCursor)) {
                setSelectedItemIds(selectedItemIds.filter((id) => id !== edgeIdUnderCursor));
                return;
            }

            setSelectedItemIds([...selectedItemIds, edgeIdUnderCursor]);
            return;
        }

        setSelectedItemIds([edgeIdUnderCursor]);
        return;
    }

    if (!nodeIdUnderCursor) {
        if (!isMultiSelect && isCanvasUnderCursor) {
            setSelectedItemIds([]);
        }

        return;
    }

    if (!selectedItemIds.includes(nodeIdUnderCursor)) {
        const newSelectedIds = selectItems({ itemId: nodeIdUnderCursor, event: e });
        setSelectedItemIds(newSelectedIds);
    }

    if (nodeIdUnderCursor && itemsState.tempEdge) {
        createEdge(nodeIdUnderCursor);
    }
}
