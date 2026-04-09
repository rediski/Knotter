import { Parameter } from '@/canvas/_core/_/parameter';
import { isNumber } from '@/canvas/_core/_/parameter.type-guards';

interface useNumberParameterProps {
    parameter: Parameter | undefined;
    updateParameter: (parameterId: string, updates: Partial<Parameter>) => void;
}

export const useNumberParameter = ({ parameter, updateParameter }: useNumberParameterProps) => {
    if (!parameter || !isNumber(parameter)) {
        return {
            handleUpdateValue: () => {},
        };
    }

    const parseNumber = (value: string): number | undefined => {
        if (value === '' || value === '-') return undefined;
        const num = parseFloat(value);
        return isNaN(num) ? undefined : num;
    };

    const handleUpdateValue = (value: string) => {
        const numValue = parseNumber(value) ?? 0;

        updateParameter(parameter.id, {
            ...parameter,
            data: numValue,
        });
    };

    return {
        handleUpdateValue,
    };
};
