import { Parameter } from '@/_core/_/parameter';
import { useItemsStore } from '@/store/useItemsStore';

export const getVisibleSelectedParametersCount = (filteredParameters: Parameter[]): number => {
    const selectedParameterIds = useItemsStore.getState().selectedParameterIds;
    return filteredParameters.filter((p) => selectedParameterIds.includes(p.id)).length;
};
