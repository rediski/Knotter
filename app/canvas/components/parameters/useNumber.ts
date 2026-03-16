import { Parameter, ParameterTypeMap } from '@/canvas/_core/_/parameter';
import { isNumber } from '@/canvas/_core/_/parameter.type-guards';

interface useNumberParameterProps {
    parameter: Parameter | undefined;
    updateParameter: (parameterId: string, updates: Partial<Parameter>) => void;
}

export const useNumberParameter = ({ parameter, updateParameter }: useNumberParameterProps) => {
    if (!parameter || !isNumber(parameter)) {
        return {
            handleUpdateMinValue: () => {},
            handleUpdateMaxValue: () => {},
        };
    }

    const parseNumber = (value: string): number | undefined => {
        if (value === '' || value === '-') return undefined;
        const num = parseFloat(value);
        return isNaN(num) ? undefined : num;
    };

    const data = parameter.data as ParameterTypeMap['number'];

    const handleUpdateMinValue = (value: string) => {
        const numValue = parseNumber(value);

        if (numValue !== undefined && data.max !== undefined && numValue > data.max) {
            return;
        }

        updateParameter(parameter.id, {
            ...parameter,
            data: {
                ...data,
                min: numValue,
            },
        });
    };

    const handleUpdateMaxValue = (value: string) => {
        const numValue = parseNumber(value);

        if (numValue !== undefined && data.min !== undefined && numValue < data.min) {
            return;
        }

        updateParameter(parameter.id, {
            ...parameter,
            data: {
                ...data,
                max: numValue,
            },
        });
    };

    return {
        handleUpdateMinValue,
        handleUpdateMaxValue,
    };
};
