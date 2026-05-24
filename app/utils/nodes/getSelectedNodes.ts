import type { Node } from '@/_core/_/canvas.types';
import type { SelectedItemsParams } from '@/_core/_/items.types';
import { getSelectedItems } from '@/utils/items/getSelectedItems';

export const getSelectedNodes = ({ items, selectedItemIds }: SelectedItemsParams): Node[] => {
    const selectedItems = getSelectedItems({ items, selectedItemIds });
    const selectedNode = selectedItems.filter((item) => item.kind === 'node');

    return selectedNode;
};

export const getSelectedNodesIds = ({ items, selectedItemIds }: SelectedItemsParams): string[] => {
    const selectedNodes = getSelectedNodes({ items, selectedItemIds });
    return selectedNodes.map((node) => node.id);
};

export const getSelectedNode = ({ items, selectedItemIds }: SelectedItemsParams): Node | null => {
    const selectedNodes = getSelectedNodes({ items, selectedItemIds });

    return selectedNodes[0] || null;
};
