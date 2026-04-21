export type ParameterTypeMap = {
    number: number;
    string: string;
    boolean: boolean;
    enum: { value: string | null; options: string[] };
    structure: string[];
};

export type ParameterType = keyof ParameterTypeMap;

export type Parameter<T extends ParameterType = ParameterType> = {
    id: string;
    name: string;
    type: T;
    value: ParameterTypeMap[T];
    defaultValue: ParameterTypeMap[T];
    parentId: string | null;
};

export const parameterTypes: { type: ParameterType; label: string }[] = [
    { type: 'number', label: 'Число' },
    { type: 'string', label: 'Текст' },
    { type: 'boolean', label: 'Флаг' },
    { type: 'enum', label: 'Список' },
    { type: 'structure', label: 'Структура' },
];
