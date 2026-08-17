export type ParameterType = 'number' | 'string' | 'boolean' | 'enum';

export type ParameterValue = string | number | boolean | string[] | null;

export type Parameter = {
    id: string;
    name: string;
    description: string;
    type: ParameterType | null;
    value: ParameterValue;
    defaultValue: ParameterValue;
    parentId: string | null;
};

export const parameterTypes: { type: ParameterType; label: string }[] = [
    { type: 'number', label: 'Число' },
    { type: 'string', label: 'Текст' },
    { type: 'boolean', label: 'Флаг' },
    { type: 'enum', label: 'Список' },
];
