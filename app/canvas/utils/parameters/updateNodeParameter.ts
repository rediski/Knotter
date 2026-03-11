import type { Parameter } from '@/canvas/_core/_/parameter';
import type { Node } from '@/canvas/_core/_/canvas.types';

import { useItemsStore } from '@/canvas/store/useItemsStore';
import { updateParameter } from '@/canvas/utils/parameters/updateParameter';

export const updateNodeParameter = (nodeId: string, parameterId: string, updates: Partial<Parameter>) => {
    const items = useItemsStore.getState().items;
    const setItems = useItemsStore.getState().setItems;

    const nodeIndex = items.findIndex((item) => item.kind === 'node' && item.id === nodeId);
    if (nodeIndex === -1) return;

    const currentNode = items[nodeIndex] as Node;

    updateParameter(parameterId, updates);

    const updatedNodeParameters = currentNode.parameters.map((param) =>
        param.id === parameterId ? { ...param, ...updates } : param,
    );

    const updatedNode: Node = {
        ...currentNode,
        parameters: updatedNodeParameters,
    };

    const updatedItems = [...items];
    updatedItems[nodeIndex] = updatedNode;

    setItems(updatedItems);
};
