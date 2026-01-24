import type { Parameter, ParameterTypeMap } from '@/canvas/components/Parameters/core/parameter.types';

// prettier-ignore
export const isNumberValue = (parameter: Parameter): 
    parameter is Parameter & { type: 'number'; value: ParameterTypeMap['number'] } => {
        return parameter.type === 'number';
    };

// prettier-ignore
export const isStringValue = (parameter: Parameter): 
    parameter is Parameter & { type: 'string'; value: ParameterTypeMap['string'] } => {
        return parameter.type === 'string';
    };

// prettier-ignore
export const isBooleanValue = (parameter: Parameter): 
    parameter is Parameter & { type: 'boolean'; value: ParameterTypeMap['boolean'] } => {
        return parameter.type === 'boolean';
    };

// prettier-ignore
export const isEnumValue = (parameter: Parameter): 
    parameter is Parameter & { type: 'enum'; value: ParameterTypeMap['enum'] } => {
        return parameter.type === 'enum';
    };

// prettier-ignore
export const isStructureValue = (parameter: Parameter): 
    parameter is Parameter & { type: 'structure'; value: ParameterTypeMap['structure'] } => {
        return parameter.type === 'structure';
    };
