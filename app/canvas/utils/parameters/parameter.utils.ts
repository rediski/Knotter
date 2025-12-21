import type {
    ParameterType,
    ParameterValue,
    Parameter,
    NumberConfig,
    EnumConfig,
} from '@/canvas/utils/parameters/parameter.types';

export const parameterTypes: { type: ParameterType; label: string }[] = [
    { type: 'number', label: 'Число' },
    { type: 'string', label: 'Текст' },
    { type: 'boolean', label: 'Флаг' },
    { type: 'enum', label: 'Список' },
    { type: 'array', label: 'Массив' },
];

export function createInitialParameterValue(type: ParameterType): ParameterValue {
    switch (type) {
        case 'number': {
            const numberConfig: NumberConfig = {
                currentValue: 0,
                min: 0,
                max: 100,
                step: 1,
            };

            return numberConfig;
        }

        case 'string': {
            return '';
        }

        case 'boolean': {
            return false;
        }

        case 'enum': {
            const enumConfig: EnumConfig = {
                currentValue: null,
                options: [],
            };

            return enumConfig;
        }

        case 'array': {
            return [] as Parameter[];
        }
    }
}
