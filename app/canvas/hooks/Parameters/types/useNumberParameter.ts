import { Parameter, NumberConfig } from '@/canvas/utils/parameters/parameter.types';

import { isNumberValue } from '@/canvas/utils/parameters/parameter.type-guards';

interface useNumberParameterProps {
    parameter: Parameter | undefined;
    updateParameter: (parameterId: string, updates: Partial<Parameter>) => void;
}

export const useNumberParameter = ({ parameter, updateParameter }: useNumberParameterProps) => {
    const handleUpdateCurrentValue = (value: string) => {
        const numValue = parseFloat(value);

        if (!parameter) return;
        if (!isNumberValue(parameter)) return;
        if (isNaN(numValue)) return;

        const thisParameterData = parameter.value as NumberConfig;

        const clampedValue = Math.max(thisParameterData.min, Math.min(numValue, thisParameterData.max));

        updateParameter(parameter.id, {
            ...parameter,

            value: {
                ...thisParameterData,
                currentValue: clampedValue,
            },
        });
    };

    const handleUpdateMinValue = (value: string) => {
        const numValue = parseFloat(value);

        if (!parameter) return;
        if (!isNumberValue(parameter)) return;
        if (isNaN(numValue)) return;

        const thisParameterData = parameter.value as NumberConfig;

        const minValue = Math.min(numValue, thisParameterData.max);

        updateParameter(parameter.id, {
            ...parameter,

            value: {
                ...thisParameterData,
                min: minValue,
            },
        });
    };

    const handleUpdateMaxValue = (value: string) => {
        const numValue = parseFloat(value);

        if (!parameter) return;
        if (!isNumberValue(parameter)) return;
        if (isNaN(numValue)) return;

        const thisParameterData = parameter.value as NumberConfig;

        const maxValue = Math.max(numValue, thisParameterData.min);

        updateParameter(parameter.id, {
            ...parameter,

            value: {
                ...thisParameterData,
                max: maxValue,
            },
        });
    };

    const handleUpdateStepValue = (value: string) => {
        const numValue = parseFloat(value);

        if (!parameter) return;
        if (!isNumberValue(parameter)) return;
        if (isNaN(numValue)) return;

        const thisParameterData = parameter.value as NumberConfig;

        const range = thisParameterData.max - thisParameterData.min;

        if (numValue > range) return;

        updateParameter(parameter.id, {
            ...parameter,

            value: {
                ...thisParameterData,
                step: numValue,
            },
        });
    };

    return { handleUpdateCurrentValue, handleUpdateMinValue, handleUpdateMaxValue, handleUpdateStepValue };
};
