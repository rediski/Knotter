import type { Node } from '@/canvas/_core/_/canvas.types';
import type { NodeParameter, Parameter } from '@/canvas/_core/_/parameter';

import { useItemsStore } from '@/canvas/store/useItemsStore';
import { getNodeById } from '@/canvas/utils/nodes/getNodeById';
import { getNodeParameterInitialValue } from '@/canvas/utils/parameters/parameterInitialValue';

const getAllDescendants = (parameterId: string, allParameters: Parameter[]): Parameter[] => {
    const descendants: Parameter[] = [];
    const stack = [parameterId];

    while (stack.length) {
        const currentId = stack.pop()!;
        const children = allParameters.filter((param) => param.parentId === currentId);

        for (const child of children) {
            descendants.push(child);
            stack.push(child.id);
        }
    }

    return descendants;
};

const convertToNodeParameter = (parameter: Parameter): NodeParameter => {
    return {
        id: parameter.id,
        name: parameter.name,
        type: parameter.type,
        parentId: parameter.parentId,
        value: getNodeParameterInitialValue(parameter.type, parameter.defaultValue),
    };
};

const addParameterToNode = (nodeId: string, parameterId: string) => {
    const itemsStore = useItemsStore.getState();

    const items = itemsStore.items;
    const setItems = itemsStore.setItems;
    const parameters = itemsStore.parameters;

    const node = items.find((item) => item.kind === 'node' && item.id === nodeId) as Node | undefined;
    const parameter = parameters.find((parameter) => parameter.id === parameterId);

    if (!node || !parameter) return;
    if (parameter.parentId !== null) return;

    const existingNodeParameterIds = new Set(node.parameters?.map((nodeParameter) => nodeParameter.id) || []);

    if (existingNodeParameterIds.has(parameter.id)) return;

    const descendants = getAllDescendants(parameter.id, parameters);
    const allParamsToAdd = [parameter, ...descendants];

    const nodeParametersToAdd = allParamsToAdd
        .filter((parameter) => !existingNodeParameterIds.has(parameter.id))
        .map((parameter) => convertToNodeParameter(parameter));

    if (nodeParametersToAdd.length === 0) return;

    const updatedItems = items.map((item) => {
        if (item.kind === 'node' && item.id === nodeId) {
            return {
                ...item,
                parameters: [...(item.parameters || []), ...nodeParametersToAdd],
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
