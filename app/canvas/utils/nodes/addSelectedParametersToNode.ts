import { getOpenedNode } from '@/canvas/utils/nodes/getOpenedNode';
import { useItemsStore } from '@/canvas/store/useItemsStore';
import { addParameterToNode } from '@/canvas/utils/parameters/addParameterToNode';

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
