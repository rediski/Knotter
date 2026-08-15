import { useItemsStore } from '@/store/useItemsStore';

export const removeParameter = () => {
    const itemsState = useItemsStore.getState();

    const parameters = itemsState.parameters;
    const setParameters = itemsState.setParameters;

    const idsToDelete = new Set<string>();

    const newParameters = parameters.filter((parameter) => !idsToDelete.has(parameter.id));

    const parameter = newParameters.map((parameter) => {
        return parameter;
    });

    setParameters(parameter);
};
