import type { Parameter } from '@/canvas/_core/_/parameter';
import { isStructure } from '@/canvas/_core/_/parameter.type-guards';
import { useItemsStore } from '@/canvas/store/useItemsStore';

export const updateParameter = (parameterId: string, updates: Partial<Parameter>) => {
    const itemsState = useItemsStore.getState();

    const parameters = itemsState.parameters;
    const setParameters = itemsState.setParameters;

    const updateRecursive = (params: Parameter[]): Parameter[] => {
        return params.map((parameter) => {
            if (parameter.id === parameterId) {
                return { ...parameter, ...updates } as Parameter;
            }

            if (isStructure(parameter)) {
                return {
                    ...parameter,
                    data: updateRecursive(parameter.data),
                };
            }

            return parameter;
        });
    };

    setParameters(updateRecursive(parameters));
};
