import { getSelectedItem } from '@/canvas/utils/items/getSelectedItem';

export const getSelectedNode = () => {
    const selectedItem = getSelectedItem();

    if (selectedItem?.kind !== 'node') return null;

    return selectedItem;
};
