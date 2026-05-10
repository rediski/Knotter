import type { Node } from '@/canvas/_core/_/canvas.types';
import { NodeParameter } from '@/canvas/_core/_/parameter';

import { useItemsStore } from '@/canvas/store/useItemsStore';
import { getNodeById } from '@/canvas/utils/nodes/getNodeById';
import { getNodeParameterInitialValue } from '@/canvas/utils/parameters/parameterInitialValue';

const addParameterToNode = (nodeId: string, parameterId: string) => {
    const itemsStore = useItemsStore.getState();

    const items = itemsStore.items;
    const setItems = itemsStore.setItems;
    const parameters = itemsStore.parameters;

    const node = items.find((item) => item.kind === 'node' && item.id === nodeId) as Node | undefined;
    const parameter = parameters.find((parameter) => parameter.id === parameterId);

    if (!node || !parameter) return;

    if (parameter.parentId !== null) return;

    if (node.parameters?.some((param) => param.id === parameterId)) return;

    const nodeParameter: NodeParameter = {
        id: parameter.id,
        name: parameter.name,
        type: parameter.type,
        parentId: parameter.parentId,
        value: getNodeParameterInitialValue(parameter.type, parameter.defaultValue),
    };

    const updatedItems = items.map((item) => {
        if (item.kind === 'node' && item.id === nodeId) {
            return {
                ...item,
                parameters: [...(item.parameters || []), nodeParameter],
            };
        }
        return item;
    });

    setItems(updatedItems);
};

export const addSelectedParametersToNode = (nodeId: string) => {
    const node = getNodeById(nodeId);
    const itemsState = useItemsStore.getState();

    const parameters = itemsState.parameters;
    const selectedParameters = itemsState.selectedParameters;
    const setSelectedParameters = itemsState.setSelectedParameters;

    if (!node || selectedParameters.size === 0) return;

    const existingNodeParameterIds = new Set(node.parameters.map((parameter) => parameter.id));

    const selectedParametersList = parameters.filter(
        (parameter) =>
            selectedParameters.has(parameter.id) &&
            parameter.parentId === null &&
            !existingNodeParameterIds.has(parameter.id),
    );

    if (selectedParametersList.length === 0) return;

    selectedParametersList.forEach((parameter) => {
        addParameterToNode(node.id, parameter.id);
    });

    setSelectedParameters(new Set());
};
