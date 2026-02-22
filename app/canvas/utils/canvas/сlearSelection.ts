import { useCanvasStore } from '@/canvas/store/canvasStore';

export const clearSelection = () => {
    const hasSelectedItems = useCanvasStore.getState().selectedItemIds.length > 0;
    const hasSelectedEdges = useCanvasStore.getState().selectedEdgeIds.length > 0;
    const hasTempEdge = useCanvasStore.getState().tempEdge !== null;

    const setSelectedItemIds = useCanvasStore.getState().setSelectedItemIds;
    const setSelectedEdgeIds = useCanvasStore.getState().setSelectedEdgeIds;
    const setTempEdge = useCanvasStore.getState().setTempEdge;

    if (hasSelectedItems) {
        setSelectedItemIds([]);
    }

    if (hasSelectedEdges) {
        setSelectedEdgeIds([]);
    }

    if (hasTempEdge) {
        setTempEdge(null);
    }
};
