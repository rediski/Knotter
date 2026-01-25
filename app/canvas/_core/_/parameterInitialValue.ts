import type { ParameterType, Parameter, ParameterTypeMap } from '@/canvas/_core/_/parameter.types';

export function parameterInitialValue(type: ParameterType): Parameter['value'] {
    switch (type) {
        case 'number': {
            const numberConfig: ParameterTypeMap['number'] = {
                currentValue: 0,
                min: 0,
                max: 100,
                step: 1,
            };

            return numberConfig;
        }

        case 'string': {
            return '' as ParameterTypeMap['string'];
        }

        case 'boolean': {
            return false as ParameterTypeMap['boolean'];
        }

        case 'enum': {
            const enumConfig: ParameterTypeMap['enum'] = {
                currentValue: null,
                options: [],
            };

            return enumConfig;
        }

        case 'structure': {
            return [] as ParameterTypeMap['structure'];
        }
    }
}
