import type { CanvasItem } from '@/canvas/_core/_/canvas.types';

export type CanvasAction =
    | { type: 'ADD_ITEMS'; items: CanvasItem[] }
    | { type: 'DELETE_ITEMS'; ids: string[] }
    | { type: 'PASTE_ITEMS'; items: CanvasItem[] };
