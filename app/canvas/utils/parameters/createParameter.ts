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
        value: parameterInitialValue(type),
        parentId: null,
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

    const newParameter: Parameter = {
        id: uuid(),
        name,
        type,
        value: parameterInitialValue(type),
        parentId: parentStructureId,
    } as Parameter;

    const updatedParameters = itemsState.parameters.map((parameter) => {
        if (parameter.id === parentStructureId && isStructure(parameter)) {
            return {
                ...parameter,
                value: [...parameter.value, newParameter.id],
            };
        }

        return parameter;
    });

    itemsState.setParameters([...updatedParameters, newParameter]);

    return newParameter;
};
