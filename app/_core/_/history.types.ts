import type { CanvasItem } from '@/_core/_/canvas.types';

export const MAX_HISTORY_SIZE = 100;

export type CanvasAction =
    | { type: 'ADD_ITEMS'; items: CanvasItem[] }
    | { type: 'DELETE_ITEMS'; items: CanvasItem[] }
    | { type: 'PASTE_ITEMS'; items: CanvasItem[] }
    | { type: 'CHANGE_ITEMS'; items: CanvasItem[] };
