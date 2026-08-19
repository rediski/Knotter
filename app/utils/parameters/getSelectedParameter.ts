import type { Parameter } from '@/_core/_/parameter';
import { useItemsStore } from '@/store/useItemsStore';

export const getSelectedParametersIds = (): string[] => {
    const { selectedParameters } = useItemsStore.getState();
    return Array.from(selectedParameters);
};

export const getSelectedParameter = (): Parameter | null => {
    const { selectedParameters, parameters } = useItemsStore.getState();

    if (selectedParameters.size === 0) {
        return null;
    }

    const firstId = selectedParameters.values().next().value;

    return parameters.find((param) => param.id === firstId) || null;
};
