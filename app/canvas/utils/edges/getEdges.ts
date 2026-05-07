import type { CanvasItem, Edge, Node } from '@/canvas/_core/_/canvas.types';

export const getEdges = (items: CanvasItem[]): Edge[] =>
    items
        .filter((item): item is Node => item.kind === 'node')
        .flatMap((node) => node.edges.map((edge) => ({ ...edge, from: node.id })));
