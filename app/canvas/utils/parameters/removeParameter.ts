import { useItemsStore } from '@/canvas/store/useItemsStore';

export const removeParameter = (parameterId: string) => {
    const itemsState = useItemsStore.getState();

    const parameters = itemsState.parameters;
    const setParameters = itemsState.setParameters;

    setParameters(parameters.filter((parameter) => parameter.id !== parameterId));
};
