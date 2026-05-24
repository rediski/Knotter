import { Parameter } from '@/_core/_/parameter';

interface useBooleanParameterProps {
    parameter: Parameter;
    updateParameter: (parameterId: string, updates: Partial<Parameter>) => void;
}

export const useBooleanParameter = ({ parameter, updateParameter }: useBooleanParameterProps) => {
    const updateDefaultValue = (checked: boolean) => {
        updateParameter(parameter.id, {
            defaultValue: checked,
        });
    };

    return {
        updateDefaultValue,
    };
};
