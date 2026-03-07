import type { CanvasItem } from '@/canvas/_core/_/canvas.types';
import type { SelectedItemsParams } from '@/canvas/_core/_/items.types';
import { getSelectedItems } from '@/canvas/utils/items/getSelectedItems';

export const getSelectedNodes = ({ items, selectedItemIds }: SelectedItemsParams): CanvasItem[] => {
    const selectedItems = getSelectedItems({ items, selectedItemIds });
    const selectedNode = selectedItems.filter((item) => item.kind === 'node');

    return selectedNode;
};

export const getSelectedNodesIds = ({ items, selectedItemIds }: SelectedItemsParams): string[] => {
    const selectedNodes = getSelectedNodes({ items, selectedItemIds });
    return selectedNodes.map((node) => node.id);
};

export const getSelectedNode = ({ items, selectedItemIds }: SelectedItemsParams): CanvasItem | null => {
    const selectedNodes = getSelectedNodes({ items, selectedItemIds });

    return selectedNodes[0] || null;
};
