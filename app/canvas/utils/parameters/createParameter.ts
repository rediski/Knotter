import type { ParameterType, Parameter } from '@/canvas/_core/_/parameter';
import { parameterInitialValue } from '@/canvas/utils/parameters/parameterInitialValue';

import { useItemsStore } from '@/canvas/store/useItemsStore';
import { isStructure } from '@/canvas/_core/_/parameter.type-guards';

import { v4 as uuid } from 'uuid';

export const createParameter = (name: string, type: ParameterType): Parameter => {
    const itemsState = useItemsStore.getState();
    const newParameter: Parameter = {
        id: uuid(),
        name,
        type,
        data: parameterInitialValue(type),
    } as Parameter;

    itemsState.setParameters([...itemsState.parameters, newParameter]);

    return newParameter;
};

export const createParameterInStructure = (
    name: string,
    type: ParameterType,
    parentStructureId: string,
): Parameter | null => {
    const itemsState = useItemsStore.getState();
    let createdParameter: Parameter | null = null;

    const findAndAddToStructure = (parameters: Parameter[]): Parameter[] => {
        return parameters.map((param) => {
            if (param.id === parentStructureId && isStructure(param)) {
                createdParameter = {
                    id: uuid(),
                    name,
                    type,
                    data: parameterInitialValue(type),
                } as Parameter;

                return {
                    ...param,
                    data: [...param.data, createdParameter],
                };
            }

            if (isStructure(param)) {
                return {
                    ...param,
                    data: findAndAddToStructure(param.data),
                };
            }

            return param;
        });
    };

    const updatedParameters = findAndAddToStructure(itemsState.parameters);

    if (!createdParameter) {
        console.error(`Структура с id "${parentStructureId}" не найдена`);
        return null;
    }

    itemsState.setParameters(updatedParameters);
    return createdParameter;
};
