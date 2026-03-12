import type { ParameterType, Parameter } from '@/canvas/_core/_/parameter';
import { parameterInitialValue } from '@/canvas/utils/parameters/parameterInitialValue';

import { useItemsStore } from '@/canvas/store/useItemsStore';
import { isStructure } from '@/canvas/_core/_/parameter.type-guards';

import { v4 as uuid } from 'uuid';

export const createParameter = (name: string, type: ParameterType): Parameter => {
    const itemsState = useItemsStore.getState();

    const parameters = itemsState.parameters;
    const setParameters = itemsState.setParameters;

    const newParameter: Parameter = {
        id: uuid(),
        name,
        type,
        data: parameterInitialValue(type),
    } as Parameter;

    setParameters([...parameters, newParameter]);

    return newParameter;
};

export const createStructureParameter = (name: string, type: ParameterType, parentStructureId: string): Parameter => {
    const itemsState = useItemsStore.getState();
    const parameters = itemsState.parameters;
    const setParameters = itemsState.setParameters;

    const parentStructure = parameters.find((p) => p.id === parentStructureId);

    if (!parentStructure || !isStructure(parentStructure)) {
        throw new Error('Родительская структура не найдена или имеет неверный тип');
    }

    const newParameter: Parameter = {
        id: uuid(),
        name,
        type,
        data: parameterInitialValue(type),
    } as Parameter;

    const updatedParentStructure: Parameter<'structure'> = {
        ...parentStructure,
        data: [...parentStructure.data, newParameter],
    };

    const updatedParameters = parameters.map((p) => (p.id === parentStructureId ? updatedParentStructure : p));

    setParameters(updatedParameters);

    return newParameter;
};
