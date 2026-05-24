import type { ParameterType, ParameterDefaultValue, NodeParameterValue } from '@/_core/_/parameter';

const INITIAL_PARAMETER_VALUES = {
    number: 0 satisfies ParameterDefaultValue['number'],
    string: '' satisfies ParameterDefaultValue['string'],
    boolean: false satisfies ParameterDefaultValue['boolean'],
    enum: [] satisfies ParameterDefaultValue['enum'],
    structure: [] satisfies ParameterDefaultValue['structure'],
} as const;

export function parameterInitialValue(type: ParameterType): ParameterDefaultValue[typeof type] {
    return INITIAL_PARAMETER_VALUES[type];
}

export function getNodeParameterInitialValue<T extends ParameterType>(
    type: T,
    defaultValue: ParameterDefaultValue[T],
): NodeParameterValue[T] {
    switch (type) {
        case 'enum': {
            const value = defaultValue as ParameterDefaultValue['enum'];
            return (value[0] ?? null) as NodeParameterValue[T];
        }
        case 'structure': {
            const value = defaultValue as ParameterDefaultValue['structure'];
            return [...value] as NodeParameterValue[T];
        }
        default: {
            return defaultValue as unknown as NodeParameterValue[T];
        }
    }
}
