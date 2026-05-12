import { isStructure } from '@/canvas/_core/_/parameter.type-guards';
import { useItemsStore } from '@/canvas/store/useItemsStore';
import { getSelectedNode } from '@/canvas/utils/nodes/getSelectedNodes';

export const unassignParameter = (parameterId: string) => {
    const itemsState = useItemsStore.getState();

    const items = itemsState.items;
    const setItems = itemsState.setItems;
    const selectedItemIds = itemsState.selectedItemIds;
    const allParameters = itemsState.parameters;

    const node = getSelectedNode({ items, selectedItemIds });

    if (!node) return;

    const getIdsToRemove = (id: string): string[] => {
        const parameter = allParameters.find((p) => p.id === id);
        if (!parameter) return [id];

        if (isStructure(parameter)) {
            const childIds = parameter.defaultValue.flatMap((childId) => getIdsToRemove(childId));
            return [id, ...childIds];
        }

        return [id];
    };

    const idsToRemove = getIdsToRemove(parameterId);

    const updatedItems = items.map((item) => {
        if (item.kind === 'node' && item.id === node.id) {
            return {
                ...item,
                parameters: item.parameters.filter((parameter) => !idsToRemove.includes(parameter.id)),
            };
        }
        return item;
    });

    setItems(updatedItems);
};
