import type { Parameter } from '@/_core/_/parameter';

import { useItemsStore } from '@/store/useItemsStore';

export const updateParameter = (parameterId: string, updates: Partial<Parameter>) => {
    const itemsState = useItemsStore.getState();
    const parameters = itemsState.parameters;
    const setParameters = itemsState.setParameters;

    const updatedParameters = parameters.map((parameter) => {
        if (parameter.id === parameterId) {
            return { ...parameter, ...updates } as Parameter;
        }

        return parameter;
    });

    setParameters(updatedParameters);
};
