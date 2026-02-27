import type { CanvasItem } from '@/canvas/_core/_/canvas.types';
import { getSelectedItems } from '@/canvas/utils/items/getSelectedItems';

export const getSelectedItem = (): CanvasItem | null => {
    const selectedItems = getSelectedItems();

    return selectedItems[0] || null;
};
