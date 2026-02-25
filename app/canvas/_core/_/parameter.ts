export type ParameterTypeMap = {
    number: { value: number; min?: number; max?: number };
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
    data: ParameterTypeMap[T];
};

export const parameterTypes: { type: ParameterType; label: string }[] = [
    { type: 'number', label: 'Число' },
    { type: 'string', label: 'Текст' },
    { type: 'boolean', label: 'Флаг' },
    { type: 'enum', label: 'Список' },
    { type: 'structure', label: 'Структура' },
];
