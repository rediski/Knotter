import { Node } from '@/canvas/_core/_/canvas.types';
import { getSelectedItems } from '@/canvas/utils/items/getSelectedItems';

export const getSelectedNodes = (): Node[] => {
    const selectedItems = getSelectedItems();
    const selectedNodes = selectedItems.filter((item): item is Node => item.kind === 'node');

    return selectedNodes;
};
