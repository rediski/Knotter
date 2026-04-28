import type { Parameter, ParameterType, ParameterTypeMap } from '@/canvas/_core/_/parameter';
import { Node } from '@/canvas/_core/_/canvas.types';

import { useItemsStore } from '@/canvas/store/useItemsStore';
import { getOpenedNode } from '@/canvas/utils/nodes/getOpenedNode';

const addParameterToNode = (nodeId: string, parameterId: string) => {
    const itemsStore = useItemsStore.getState();

    const items = itemsStore.items;
    const setItems = itemsStore.setItems;
    const parameters = itemsStore.parameters;

    const node = items.find((item) => item.kind === 'node' && item.id === nodeId) as Node | undefined;
    const parameter = parameters.find((parameter) => parameter.id === parameterId);

    if (!node || !parameter) return;

    if (parameter.parentId !== null) return;

    const parameterExists = node.parameters?.some((param) => param.id === parameterId);

    if (parameterExists) return;

    let value: ParameterTypeMap[ParameterType];

    if (parameter.type === 'enum') {
        const enumValue = parameter.value as { selected: string | null; options: string[] };
        value = {
            selected: enumValue.options[0] || null,
            options: enumValue.options,
        };
    }

    if (parameter.type !== 'enum' && parameter.type !== 'structure') {
        const paramWithDefault = parameter as Parameter & { defaultValue: ParameterTypeMap[typeof parameter.type] };
        value = paramWithDefault.defaultValue;
    }

    if (parameter.type === 'structure') {
        value = parameter.value;
    }

    const nodeParameter: Parameter = {
        ...parameter,
        value: value!,
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

export const addSelectedParametersToNode = () => {
    const openedNode = getOpenedNode();
    const itemsState = useItemsStore.getState();

    const parameters = itemsState.parameters;
    const selectedParameters = itemsState.selectedParameters;
    const setSelectedParameters = itemsState.setSelectedParameters;

    if (!openedNode || selectedParameters.size === 0) return;

    const existingNodeParameterIds = new Set(openedNode.parameters.map((parameter) => parameter.id));

    const selectedParametersList = parameters.filter(
        (parameter) =>
            selectedParameters.has(parameter.id) &&
            parameter.parentId === null &&
            !existingNodeParameterIds.has(parameter.id),
    );

    if (selectedParametersList.length === 0) return;

    selectedParametersList.forEach((parameter) => {
        addParameterToNode(openedNode.id, parameter.id);
    });

    setSelectedParameters(new Set());
};
