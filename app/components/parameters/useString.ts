import { Parameter } from '@/_core/_/parameter';

interface useStringParameterProps {
    parameter: Parameter;
    updateParameter: (parameterId: string, updates: Partial<Parameter>) => void;
}

export const useStringParameter = ({ parameter, updateParameter }: useStringParameterProps) => {
    if (!parameter || parameter.type !== 'string') {
        return { updateDefaultValue: () => {} };
    }

    const updateDefaultValue = (value: string) => {
        updateParameter(parameter.id, {
            defaultValue: value,
        });
    };

    return {
        updateDefaultValue,
    };
};
