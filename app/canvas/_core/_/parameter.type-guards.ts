import type { Parameter, NodeParameter, ParameterType } from '@/canvas/_core/_/parameter';

const createTypeGuard = <T extends ParameterType>(type: T) => {
    return (parameter: Parameter | NodeParameter): parameter is Parameter<T> | NodeParameter<T> => {
        return parameter.type === type;
    };
};

export const isNumber = createTypeGuard('number');
export const isString = createTypeGuard('string');
export const isBoolean = createTypeGuard('boolean');
export const isEnum = createTypeGuard('enum');
export const isStructure = createTypeGuard('structure');
