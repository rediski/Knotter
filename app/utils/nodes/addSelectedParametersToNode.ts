import type { Node } from '@/_core/_/canvas.types';
import type { NodeParameter, Parameter } from '@/_core/_/parameter';

import { useItemsStore } from '@/store/useItemsStore';
import { getNodeById } from '@/utils/nodes/getNodeById';
import { getNodeParameterInitialValue } from '@/utils/parameters/parameterInitialValue';

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
    const { currentSceneId, scenes, parameters } = useItemsStore.getState();

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

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

    if (scene) {
        const updatedScene = {
            ...scene,
            items: updatedItems,
            updatedAt: new Date(),
        };
        useItemsStore.setState({ scenes: { ...scenes, [currentSceneId]: updatedScene } });
    }
};

export const addSelectedParametersToNode = (nodeId: string) => {
    const node = getNodeById(nodeId);
    const { currentSceneId, parameters, selectedParameters, setSelectedParameters } = useItemsStore.getState();

    if (!currentSceneId) return;

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
