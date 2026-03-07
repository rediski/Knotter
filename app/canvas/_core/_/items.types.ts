import type { CanvasItem } from '@/canvas/_core/_/canvas.types';

export interface SelectedItemsParams {
    items: CanvasItem[];
    selectedItemIds: string[];
}
