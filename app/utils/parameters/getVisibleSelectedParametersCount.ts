import { Parameter } from '@/_core/_/parameter';
import { useItemsStore } from '@/store/useItemsStore';

export const getVisibleSelectedParametersCount = (parameters: Parameter[]): number => {
    const selectedParameterIds = useItemsStore.getState().selectedParameterIds;
    return parameters.filter((parameter) => selectedParameterIds.includes(parameter.id)).length;
};
