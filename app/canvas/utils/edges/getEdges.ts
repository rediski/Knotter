import type { CanvasItem, Edge } from '@/canvas/_core/_/canvas.types';

export const getEdges = (items: CanvasItem[]): Edge[] => {
    const edges: Edge[] = [];

    for (const item of items) {
        if (item.kind !== 'node') continue;

        for (const edge of item.edges) {
            edges.push({
                ...edge,
                from: item.id,
            });
        }
    }

    return edges;
};
