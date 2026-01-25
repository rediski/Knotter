import { CanvasItem, Edge } from '@/canvas/_core/_/canvas.types';

export const getEdges = (items: CanvasItem[]): Edge[] => items.filter((i): i is Edge => i.kind === 'edge');
