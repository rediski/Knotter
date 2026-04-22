import { useItemsStore } from '@/canvas/store/useItemsStore';
import { getSelectedNode } from '@/canvas/utils/nodes/getSelectedNodes';

export const unassignParameter = (parameterId: string) => {
    const itemsState = useItemsStore.getState();

    const items = itemsState.items;
    const setItems = itemsState.setItems;
    const selectedItemIds = itemsState.selectedItemIds;

    const node = getSelectedNode({ items, selectedItemIds });

    if (!node) return;

    const parameterExists = node.parameters.some((parameter) => parameter.id === parameterId);
    if (!parameterExists) return;

    const updatedItems = items.map((item) => {
        if (item.kind === 'node' && item.id === node.id) {
            return {
                ...item,
                parameters: item.parameters.filter((parameter) => parameter.id !== parameterId),
            };
        }
        return item;
    });

    setItems(updatedItems);
};
