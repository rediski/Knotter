import type { CanvasItem, Position } from '@/canvas/_core/_/canvas.types';
import type { getSelectedItemsParams } from '@/canvas/_core/_/items.types';

export const getSelectedItems = ({ items, selectedItemIds }: getSelectedItemsParams): CanvasItem[] => {
    const selectedIdsSet = new Set(selectedItemIds);
    const selectedItems = items.filter((item) => selectedIdsSet.has(item.id));

    return selectedItems;
};

export function getSelectedItemsPositions({ items, selectedItemIds }: getSelectedItemsParams): Map<string, Position> {
    const selectedItems = getSelectedItems({ items, selectedItemIds });
    const positions = new Map(selectedItems.map((item) => [item.id, { ...item.position }]));

    return positions;
}

export const getSelectedItem = ({ items, selectedItemIds }: getSelectedItemsParams): CanvasItem | null => {
    const selectedItems = getSelectedItems({ items, selectedItemIds });

    return selectedItems[0] || null;
};
