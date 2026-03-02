import type { ParameterType, Parameter } from '@/canvas/_core/_/parameter';
import { parameterInitialValue } from '@/canvas/utils/parameters/parameterInitialValue';

import { useItemsStore } from '@/canvas/store/useItemsStore';

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
