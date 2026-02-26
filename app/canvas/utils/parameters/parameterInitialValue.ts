import type { ParameterType, Parameter, ParameterTypeMap } from '@/canvas/_core/_/parameter';

export function parameterInitialValue(type: ParameterType): Parameter['data'] {
    switch (type) {
        case 'number': {
            const numberConfig: ParameterTypeMap['number'] = {
                value: 0,
                min: undefined,
                max: undefined,
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
                value: null,
                options: [],
            };
            return enumConfig;
        }

        case 'structure': {
            return [] as ParameterTypeMap['structure'];
        }
    }
}
