import { CanvasItem, Node } from '@/canvas/_core/_/canvas.types';

export const getNodes = (items: CanvasItem[]): Node[] => items.filter((item): item is Node => item.kind === 'node');
