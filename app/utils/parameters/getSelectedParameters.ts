import type { Parameter } from '@/_core/_/parameter';
import { useItemsStore } from '@/store/useItemsStore';

export const getSelectedParameters = (): Parameter[] => {
    const itemsState = useItemsStore.getState();

    const parameters = itemsState.parameters;
    const selectedParameterIds = itemsState.selectedParameterIds;

    const selectedIdsSet = new Set(selectedParameterIds);
    const selectedParameters = parameters.filter((param) => selectedIdsSet.has(param.id));

    return selectedParameters;
};

export const getSelectedParameter = (): Parameter | null => {
    const selectedParameters = getSelectedParameters();

    return selectedParameters[0] || null;
};
