import { useItemsStore } from '@/canvas/store/useItemsStore';
import { Parameter } from '@/canvas/_core/_/parameter';
import { isStructure } from '@/canvas/_core/_/parameter.type-guards';

const removeParameterFromStructure = (parameters: Parameter[], targetId: string): Parameter[] => {
    return parameters
        .filter((param) => param.id !== targetId)
        .map((param) => {
            if (isStructure(param)) {
                return {
                    ...param,
                    data: removeParameterFromStructure(param.data, targetId),
                };
            }

            return param;
        });
};

export const removeParameter = (parameterId: string) => {
    const itemsState = useItemsStore.getState();

    const parameters = itemsState.parameters;
    const setParameters = itemsState.setParameters;

    const updatedParameters = removeParameterFromStructure(parameters, parameterId);
    setParameters(updatedParameters);
};
