export type ParameterType = 'number' | 'string' | 'boolean' | 'enum' | 'array';
export type ParameterValue = NumberConfig | string | boolean | EnumConfig | Parameter[];

export interface Parameter {
    id: string;
    name: string;
    type: ParameterType;
    value: ParameterValue;
}

export type NumberConfig = {
    currentValue: number;
    min: number;
    max: number;
    step: number;
};

export type EnumConfig = {
    currentValue: string | null;
    options: EnumOption[];
};

export type EnumOption = {
    id: string;
    name: string;
    value: string;
};
