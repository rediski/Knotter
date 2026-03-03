import type { ParameterType, Parameter, ParameterTypeMap } from '@/canvas/_core/_/parameter';

const INITIAL_PARAMETER_VALUES = {
    number: { value: 0, min: undefined, max: undefined } satisfies ParameterTypeMap['number'],
    string: '' satisfies ParameterTypeMap['string'],
    boolean: false satisfies ParameterTypeMap['boolean'],
    enum: { value: null, options: [] } satisfies ParameterTypeMap['enum'],
    structure: [] satisfies ParameterTypeMap['structure'],
} as const;

export function parameterInitialValue(type: ParameterType): Parameter['data'] {
    return INITIAL_PARAMETER_VALUES[type];
}
