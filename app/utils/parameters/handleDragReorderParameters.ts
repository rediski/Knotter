import { Parameter } from '@/_core/_/parameter';
import { useItemsStore } from '@/store/useItemsStore';

const updateSiblingsOrder = (currentParameter: Parameter, newSiblingsIds: string[]) => {
    const itemsState = useItemsStore.getState();
    const setParameters = itemsState.setParameters;

    const parameters = itemsState.parameters;

    if (currentParameter.parentId) {
        const updatedParameters = parameters.map((parameter) => {
            if (parameter.id === currentParameter.parentId) {
                return { ...parameter, defaultValue: newSiblingsIds };
            }

            return parameter;
        });

        setParameters(updatedParameters);
        return;
    }

    const otherParameters = parameters.filter((parameter) => parameter.parentId !== null);
    const newRootParameters = newSiblingsIds
        .map((id) => parameters.find((parameter) => parameter.id === id))
        .filter((parameter): parameter is Parameter => parameter !== undefined);

    setParameters([...newRootParameters, ...otherParameters]);
};

export const handleDragReorderParameters = (newParameters: Parameter[]) => {
    const itemsState = useItemsStore.getState();

    const parameters = itemsState.parameters;
    const selectedParameterIds = itemsState.selectedParameterIds;

    const firstSelectedId = selectedParameterIds[0];
    if (!firstSelectedId) return;

    const firstSelected = parameters.find((p) => p.id === firstSelectedId);
    if (!firstSelected) return;

    const parentId = firstSelected.parentId;

    const newSiblingsIds = newParameters
        .filter((parameter) => parameter.parentId === parentId)
        .map((parameter) => parameter.id);

    updateSiblingsOrder(firstSelected, newSiblingsIds);
};
