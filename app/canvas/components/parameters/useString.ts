import { Parameter } from '@/canvas/_core/_/parameter';
import { isString } from '@/canvas/_core/_/parameter.type-guards';

interface useStringParameterProps {
    parameter: Parameter;
    updateParameter: (parameterId: string, updates: Partial<Parameter>) => void;
}

export const useStringParameter = ({ parameter, updateParameter }: useStringParameterProps) => {
    if (!parameter || !isString(parameter)) {
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
