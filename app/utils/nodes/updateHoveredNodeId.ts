import { useItemsStore } from '@/store/useItemsStore';
import { getNodeIdUnderCursor } from '@/utils/nodes/getNodeIdUnderCursor';

export function updateHoveredNodeId(e: MouseEvent) {
    const itemsStore = useItemsStore.getState();
    const setHoveredNodeId = itemsStore.setHoveredNodeId;
    const hoveredNodeId = itemsStore.hoveredNodeId;

    const nodeIdUnderCursor = getNodeIdUnderCursor({ x: e.clientX, y: e.clientY });

    if (hoveredNodeId !== nodeIdUnderCursor) {
        setHoveredNodeId(hoveredNodeId);
    }
}
