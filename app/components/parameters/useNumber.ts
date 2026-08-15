import { Parameter } from '@/_core/_/parameter';

interface useNumberParameterProps {
    parameter: Parameter | undefined;
    updateParameter: (parameterId: string, updates: Partial<Parameter>) => void;
}

export const useNumberParameter = ({ parameter, updateParameter }: useNumberParameterProps) => {
    if (!parameter || parameter.type !== 'number') {
        return {
            updateDefaultValue: () => {},
        };
    }

    const parseNumber = (value: string): number | undefined => {
        if (value === '' || value === '-') return undefined;
        const num = parseFloat(value);
        return isNaN(num) ? undefined : num;
    };

    const updateDefaultValue = (value: string) => {
        const numValue = parseNumber(value) ?? 0;

        updateParameter(parameter.id, {
            ...parameter,
            defaultValue: numValue,
        });
    };

    return {
        updateDefaultValue,
    };
};
