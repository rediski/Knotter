import { Parameter, ParameterTypeMap } from '@/canvas/components/Parameters/core/parameter.types';
import { isNumberValue } from '@/canvas/components/Parameters/core/parameter.type-guards';

interface useNumberParameterProps {
    parameter: Parameter | undefined;
    updateParameter: (parameterId: string, updates: Partial<Parameter>) => void;
}

export const useNumberParameter = ({ parameter, updateParameter }: useNumberParameterProps) => {
    const parseNumberWithValidation = (value: string): number | null => {
        if (value === '' || value === '-') {
            return null;
        }

        const numValue = parseFloat(value);
        return isNaN(numValue) ? null : numValue;
    };

    const handleUpdateCurrentValue = (value: string) => {
        if (!parameter || !isNumberValue(parameter)) return;

        const numValue = parseNumberWithValidation(value);
        if (numValue === null) return;

        const thisParameterData = parameter.value as ParameterTypeMap['number'];

        let newMin = thisParameterData.min;
        let newMax = thisParameterData.max;

        if (numValue < newMin) {
            newMin = numValue;
        } else if (numValue > newMax) {
            newMax = numValue;
        }

        const clampedValue = Math.max(newMin, Math.min(numValue, newMax));

        updateParameter(parameter.id, {
            ...parameter,
            value: {
                ...thisParameterData,
                currentValue: clampedValue,
                min: newMin,
                max: newMax,
            },
        });
    };

    const handleUpdateMinValue = (value: string) => {
        if (!parameter || !isNumberValue(parameter)) return;

        const numValue = parseNumberWithValidation(value);
        if (numValue === null) return;

        const thisParameterData = parameter.value as ParameterTypeMap['number'];

        const minValue = numValue;
        const currentValue = Math.max(minValue, thisParameterData.currentValue);
        const maxValue = Math.max(minValue, thisParameterData.max);

        updateParameter(parameter.id, {
            ...parameter,
            value: {
                ...thisParameterData,
                min: minValue,
                currentValue: currentValue,
                max: maxValue,
            },
        });
    };

    const handleUpdateMaxValue = (value: string) => {
        if (!parameter || !isNumberValue(parameter)) return;

        const numValue = parseNumberWithValidation(value);
        if (numValue === null) return;

        const thisParameterData = parameter.value as ParameterTypeMap['number'];

        const maxValue = numValue;
        const minValue = Math.min(maxValue, thisParameterData.min);
        const currentValue = Math.min(maxValue, thisParameterData.currentValue);

        updateParameter(parameter.id, {
            ...parameter,
            value: {
                ...thisParameterData,
                max: maxValue,
                currentValue: currentValue,
                min: minValue,
            },
        });
    };

    const handleUpdateStepValue = (value: string) => {
        if (!parameter || !isNumberValue(parameter)) return;

        const numValue = parseNumberWithValidation(value);
        if (numValue === null) return;

        const thisParameterData = parameter.value as ParameterTypeMap['number'];

        if (numValue <= 0) return;

        const stepValue = numValue;

        updateParameter(parameter.id, {
            ...parameter,
            value: {
                ...thisParameterData,
                step: stepValue,
            },
        });
    };

    return {
        handleUpdateCurrentValue,
        handleUpdateMinValue,
        handleUpdateMaxValue,
        handleUpdateStepValue,
    };
};
