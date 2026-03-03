import { useItemsStore } from '@/canvas/store/useItemsStore';
import { getNodeIdUnderCursor } from '@/canvas/utils/nodes/getNodeIdUnderCursor';

export function updateHoveredNodeId(e: MouseEvent) {
    const itemsStore = useItemsStore.getState();
    const setHoveredNodeId = itemsStore.setHoveredNodeId;
    const hoveredNodeId = itemsStore.hoveredNodeId;

    const nodeIdUnderCursor = getNodeIdUnderCursor({ x: e.clientX, y: e.clientY });

    if (hoveredNodeId !== nodeIdUnderCursor) {
        setHoveredNodeId(hoveredNodeId);
    }
}
