import { useItemsStore } from '@/store/useItemsStore';
import { isStructure } from '@/_core/_/parameter.type-guards';

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
            parameter.defaultValue.forEach((childId) => collectIds(childId));
        }
    };

    collectIds(parameterId);

    const newParameters = parameters.filter((parameter) => !idsToDelete.has(parameter.id));

    const cleanedParameters = newParameters.map((parameter) => {
        if (isStructure(parameter)) {
            return {
                ...parameter,
                defaultValue: parameter.defaultValue.filter((id) => !idsToDelete.has(id)),
            };
        }
        return parameter;
    });

    setParameters(cleanedParameters);
};
