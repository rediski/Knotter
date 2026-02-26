import type { ParameterType, Parameter } from '@/canvas/_core/_/parameter';
import { parameterInitialValue } from '@/canvas/utils/parameters/parameterInitialValue';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { v4 as uuid } from 'uuid';

export const createParameter = (name: string, type: ParameterType): Parameter => {
    const state = useCanvasStore.getState();

    const parameters = state.parameters;
    const setParameters = state.setParameters;

    const newParameter: Parameter = {
        id: uuid(),
        name,
        type,
        data: parameterInitialValue(type),
    } as Parameter;

    setParameters([...parameters, newParameter]);

    return newParameter;
};
