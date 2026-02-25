import type { Parameter, ParameterType, ParameterTypeMap } from '@/canvas/_core/_/parameter';

const createTypeGuard = <T extends ParameterType>(type: T) => {
    return (parameter: Parameter): parameter is Parameter & { type: T; data: ParameterTypeMap[T] } => {
        return parameter.type === type;
    };
};

export const isNumber = createTypeGuard('number');
export const isString = createTypeGuard('string');
export const isBoolean = createTypeGuard('boolean');
export const isEnum = createTypeGuard('enum');
export const isStructure = createTypeGuard('structure');
