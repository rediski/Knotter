import type { CanvasItem, Edge } from '@/canvas/_core/_/canvas.types';
import { getEdges } from '@/canvas/utils/edges/getEdges';

export const getOutgoingEdges = (items: CanvasItem[], nodeId?: string): Edge[] => {
    if (!nodeId) return [];

    const edges = getEdges(items);

    return edges.filter((edge) => edge.from === nodeId);
};
