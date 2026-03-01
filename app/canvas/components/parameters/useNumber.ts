import { Parameter, ParameterTypeMap } from '@/canvas/_core/_/parameter';
import { isNumber } from '@/canvas/_core/_/parameter.type-guards';

interface useNumberParameterProps {
    parameter: Parameter | undefined;
    updateParameter: (parameterId: string, updates: Partial<Parameter>) => void;
}

export const useNumberParameter = ({ parameter, updateParameter }: useNumberParameterProps) => {
    const parseNumberWithValidation = (value: string): number | null | undefined => {
        if (value === '' || value === '-') {
            return undefined;
        }

        const numValue = parseFloat(value);
        return isNaN(numValue) ? null : numValue;
    };

    const handleUpdateCurrentValue = (value: string) => {
        if (!parameter || !isNumber(parameter)) return;

        const numValue = parseNumberWithValidation(value);
        if (numValue === null) return;

        const thisParameterData = parameter.data as ParameterTypeMap['number'];

        if (numValue === undefined) return;

        let newMin = thisParameterData.min;
        let newMax = thisParameterData.max;

        if (newMin !== undefined && numValue < newMin) {
            newMin = numValue;
        }

        if (newMax !== undefined && numValue > newMax) {
            newMax = numValue;
        }

        let clampedValue = numValue;

        if (newMin !== undefined) {
            clampedValue = Math.max(clampedValue, newMin);
        }
        if (newMax !== undefined) {
            clampedValue = Math.min(clampedValue, newMax);
        }

        updateParameter(parameter.id, {
            ...parameter,
            data: {
                ...thisParameterData,
                value: clampedValue,
                ...(newMin !== thisParameterData.min && { min: newMin }),
                ...(newMax !== thisParameterData.max && { max: newMax }),
            },
        });
    };

    const handleUpdateMinValue = (value: string) => {
        if (!parameter || !isNumber(parameter)) return;

        const numValue = parseNumberWithValidation(value);

        const thisParameterData = parameter.data as ParameterTypeMap['number'];

        if (numValue === undefined) {
            updateParameter(parameter.id, {
                ...parameter,
                data: {
                    ...thisParameterData,
                    min: undefined,
                },
            });
            return;
        }

        if (numValue === null) return;

        const minValue = numValue;

        const currentValue = Math.max(minValue, thisParameterData.value);
        const maxValue = thisParameterData.max !== undefined ? Math.max(minValue, thisParameterData.max) : undefined;

        updateParameter(parameter.id, {
            ...parameter,
            data: {
                ...thisParameterData,
                min: minValue,
                value: currentValue,
                ...(maxValue !== undefined && { max: maxValue }),
            },
        });
    };

    const handleUpdateMaxValue = (value: string) => {
        if (!parameter || !isNumber(parameter)) return;

        const numValue = parseNumberWithValidation(value);

        const thisParameterData = parameter.data as ParameterTypeMap['number'];

        if (numValue === undefined) {
            updateParameter(parameter.id, {
                ...parameter,
                data: {
                    ...thisParameterData,
                    max: undefined,
                },
            });
            return;
        }

        if (numValue === null) return;

        const maxValue = numValue;

        const currentValue = Math.min(maxValue, thisParameterData.value);
        const minValue = thisParameterData.min !== undefined ? Math.min(maxValue, thisParameterData.min) : undefined;

        updateParameter(parameter.id, {
            ...parameter,
            data: {
                ...thisParameterData,
                max: maxValue,
                value: currentValue,
                ...(minValue !== undefined && { min: minValue }),
            },
        });
    };

    return {
        handleUpdateCurrentValue,
        handleUpdateMinValue,
        handleUpdateMaxValue,
    };
};
