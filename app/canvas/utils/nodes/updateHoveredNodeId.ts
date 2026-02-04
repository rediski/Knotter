import { useCanvasStore } from '@/canvas/store/canvasStore';
import { getNodeIdUnderCursor } from '@/canvas/utils/nodes/getNodeIdUnderCursor';

export function updateHoveredNodeId(e: MouseEvent) {
    const setHoveredNodeId = useCanvasStore.getState().setHoveredNodeId;
    const hoveredNodeId = getNodeIdUnderCursor({ x: e.clientX, y: e.clientY });

    setHoveredNodeId(hoveredNodeId);
}
