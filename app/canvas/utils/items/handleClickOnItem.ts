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

    const nodeIdUnderCursor = getNodeIdUnderCursor(point);
    const edgeIdUnderCursor = getEdgeIdUnderCursor(point);

    if (edgeIdUnderCursor) {
        if (isMultiSelect) {
            if (selectedEdgeIds.includes(edgeIdUnderCursor)) {
                setSelectedEdgeIds(selectedEdgeIds.filter((id) => id !== edgeIdUnderCursor));
                return;
            }

            setSelectedEdgeIds([...selectedEdgeIds, edgeIdUnderCursor]);
            return;
        }

        setSelectedEdgeIds([edgeIdUnderCursor]);
        setSelectedItemIds([]);
        return;
    }

    if (!nodeIdUnderCursor) {
        if (!isMultiSelect && isCanvasUnderCursor) {
            setSelectedItemIds([]);
            setSelectedEdgeIds([]);
        }

        return;
    }

    if (!isMultiSelect && selectedEdgeIds.length > 0) {
        setSelectedEdgeIds([]);
    }

    if (!selectedItemIds.includes(nodeIdUnderCursor)) {
        const newSelectedIds = selectItems({ itemId: nodeIdUnderCursor, event: e });
        setSelectedItemIds(newSelectedIds);
    }

    if (nodeIdUnderCursor) {
        createEdge(nodeIdUnderCursor);
    }
}
