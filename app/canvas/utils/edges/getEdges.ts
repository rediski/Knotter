import type { CanvasItem, Edge, Node } from '@/canvas/_core/_/canvas.types';

export const getEdges = (items: CanvasItem[]): Edge[] => items.filter((item): item is Edge => item.kind === 'edge');
