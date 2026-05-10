export type ParameterType = 'number' | 'string' | 'boolean' | 'enum' | 'structure';

export type ParameterDefaultValue = {
    number: number;
    string: string;
    boolean: boolean;
    enum: string[];
    structure: string[];
};

export type NodeParameterValue = {
    number: number;
    string: string;
    boolean: boolean;
    enum: string | null;
    structure: string[];
};

export type Parameter<T extends ParameterType = ParameterType> = {
    id: string;
    name: string;
    type: T;
    defaultValue: ParameterDefaultValue[T];
    parentId: string | null;
};

export type NodeParameter<T extends ParameterType = ParameterType> = {
    id: string;
    name: string;
    type: T;
    parentId: string | null;
    value: NodeParameterValue[T];
};

export const parameterTypes: { type: ParameterType; label: string }[] = [
    { type: 'number', label: 'Число' },
    { type: 'string', label: 'Текст' },
    { type: 'boolean', label: 'Флаг' },
    { type: 'enum', label: 'Список' },
    { type: 'structure', label: 'Структура' },
];
