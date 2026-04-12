import { Parameter } from '@/canvas/_core/_/parameter';

interface useBooleanParameterProps {
    parameter: Parameter;
    updateParameter: (parameterId: string, updates: Partial<Parameter>) => void;
}

export const useBooleanParameter = ({ parameter, updateParameter }: useBooleanParameterProps) => {
    const handleUpdateValue = (checked: boolean) => {
        updateParameter(parameter.id, {
            ...parameter,
            data: checked,
        });
    };

    return {
        handleUpdateValue,
    };
};
