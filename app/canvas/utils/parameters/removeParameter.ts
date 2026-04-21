import { useItemsStore } from '@/canvas/store/useItemsStore';
import { isStructure } from '@/canvas/_core/_/parameter.type-guards';

export const removeParameter = (parameterId: string) => {
    const itemsState = useItemsStore.getState();

    const parameters = itemsState.parameters;
    const setParameters = itemsState.setParameters;

    const idsToDelete = new Set<string>();

    const collectIds = (id: string) => {
        if (idsToDelete.has(id)) return;

        idsToDelete.add(id);

        const parameter = parameters.find((parameter) => parameter.id === id);

        if (parameter && isStructure(parameter)) {
            parameter.value.forEach((childId) => collectIds(childId));
        }
    };

    collectIds(parameterId);

    const newParameters = parameters.filter((parameter) => !idsToDelete.has(parameter.id));

    const cleanedParameters = newParameters.map((parameter) => {
        if (isStructure(parameter)) {
            return {
                ...parameter,
                value: parameter.value.filter((id) => !idsToDelete.has(id)),
            };
        }
        return parameter;
    });

    setParameters(cleanedParameters);
};
