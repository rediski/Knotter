import { CanvasItem, Node } from '@/canvas/_core/_/canvas.types';

export const getNodes = (items: CanvasItem[]): Node[] => items.filter((i): i is Node => i.kind === 'node');
