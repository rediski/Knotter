import type { NodeParameterValue } from '@/canvas/_core/_/parameter';
import type { Node } from '@/canvas/_core/_/canvas.types';

import { useItemsStore } from '@/canvas/store/useItemsStore';

export const updateNodeParameter = <T extends keyof NodeParameterValue>(
    nodeId: string,
    parameterId: string,
    value: NodeParameterValue[T],
) => {
    const items = useItemsStore.getState().items;
    const setItems = useItemsStore.getState().setItems;

    const nodeIndex = items.findIndex((item) => item.kind === 'node' && item.id === nodeId);
    if (nodeIndex === -1) return;

    const currentNode = items[nodeIndex] as Node;

    const updatedNodeParameters = currentNode.parameters.map((param) =>
        param.id === parameterId ? { ...param, value } : param,
    );

    const updatedNode: Node = {
        ...currentNode,
        parameters: updatedNodeParameters,
    };

    const updatedItems = [...items];
    updatedItems[nodeIndex] = updatedNode;

    setItems(updatedItems);
};
