import type { Parameter } from '@/canvas/_core/_/parameter';
import { isStructure } from '@/canvas/_core/_/parameter.type-guards';

interface UseStructureParameterProps {
    parameter: Parameter | undefined;
    updateParameter: (parameterName: string, value: string[]) => void;
}

export const useStructureParameter = ({ parameter, updateParameter }: UseStructureParameterProps) => {
    const addParameterToStructure = (parameterNameToAdd: string) => {
        if (!parameter) return;
        if (!isStructure(parameter)) return;

        if (parameter.data.includes(parameterNameToAdd)) {
            return;
        }

        const updatedValue = [...parameter.data, parameterNameToAdd];
        updateParameter(parameter.name, updatedValue);
    };

    const removeParameterFromStructure = (parameterNameToRemove: string) => {
        if (!parameter) return;
        if (!isStructure(parameter)) return;

        const updatedValue = parameter.data.filter((name) => name !== parameterNameToRemove);
        updateParameter(parameter.name, updatedValue);
    };

    const reorderParameters = (parameterNames: string[]) => {
        if (!parameter) return;
        if (!isStructure(parameter)) return;

        updateParameter(parameter.name, parameterNames);
    };

    const clearStructure = () => {
        if (!parameter) return;
        if (!isStructure(parameter)) return;

        updateParameter(parameter.name, []);
    };

    return {
        addParameterToStructure,
        removeParameterFromStructure,
        reorderParameters,
        clearStructure,
    };
};
