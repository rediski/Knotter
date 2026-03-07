import type { CanvasItem, Position } from '@/canvas/_core/_/canvas.types';
import type { SelectedItemsParams } from '@/canvas/_core/_/items.types';

export const getSelectedItems = ({ items, selectedItemIds }: SelectedItemsParams): CanvasItem[] => {
    const selectedIdsSet = new Set(selectedItemIds);
    const selectedItems = items.filter((item) => selectedIdsSet.has(item.id));

    return selectedItems;
};

export function getSelectedItemsPositions({ items, selectedItemIds }: SelectedItemsParams): Map<string, Position> {
    const selectedItems = getSelectedItems({ items, selectedItemIds });
    const positions = new Map(selectedItems.map((item) => [item.id, { ...item.position }]));

    return positions;
}

export const getSelectedItem = ({ items, selectedItemIds }: SelectedItemsParams): CanvasItem | null => {
    const selectedItems = getSelectedItems({ items, selectedItemIds });

    return selectedItems[0] || null;
};
