import { useCanvasStore } from '@/canvas/store/canvasStore';
import type { CanvasItem } from '@/canvas/_core/_/canvas.types';
import { getEdges } from '@/canvas/utils/edges/getEdges';

export function selectAllEdges() {
    const items: CanvasItem[] = useCanvasStore.getState().items;
    const setSelectedEdgeIds = useCanvasStore.getState().setSelectedEdgeIds;

    const edges = getEdges(items);

    setSelectedEdgeIds(edges.map((edge) => edge.id));
}
