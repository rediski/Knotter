import type { NumberConfig, EnumConfig, Parameter } from '@/canvas/utils/parameters/parameter.types';

// prettier-ignore
export const isNumberValue = (parameter: Parameter): 
    parameter is Parameter & { type: 'number'; value: NumberConfig } => {
        return parameter.type === 'number';
    };

// prettier-ignore
export const isStringValue = (parameter: Parameter): 
    parameter is Parameter & { type: 'string'; value: string } => {
        return parameter.type === 'string';
    };

// prettier-ignore
export const isBooleanValue = (parameter: Parameter): 
    parameter is Parameter & { type: 'boolean'; value: boolean } => {
        return parameter.type === 'boolean';
    };

// prettier-ignore
export const isEnumValue = (parameter: Parameter): 
    parameter is Parameter & { type: 'enum'; value: EnumConfig } => {
        return parameter.type === 'enum';
    };

// prettier-ignore
export const isArrayValue = (parameter: Parameter): 
    parameter is Parameter & { type: 'array'; value: Parameter[] } => {
        return parameter.type === 'array';
    };
