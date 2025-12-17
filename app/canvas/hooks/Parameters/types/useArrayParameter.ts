import { Parameter, ParameterValue } from '@/canvas/utils/parameters/parameter.types';
import { isArrayValue } from '@/canvas/utils/parameters/parameter.type-guards';

interface useArrayParameterProps {
    parameter: Parameter | undefined;
    updateParameter: (parameterId: string, updates: Partial<Parameter>) => void;
}

export const useArrayParameter = ({ parameter, updateParameter }: useArrayParameterProps) => {
    const handleAddArrayParameter = (newParameter: Parameter) => {
        if (!parameter) return;
        if (!isArrayValue(parameter)) return;

        const updatedArray = [...parameter.value, newParameter];

        updateParameter(parameter.id, {
            ...parameter,
            value: updatedArray,
        });
    };

    const handleRemoveArrayParameter = (parameterId: string) => {
        if (!parameter) return;
        if (!isArrayValue(parameter)) return;

        const updatedArray = parameter.value.filter((item) => item.id !== parameterId);

        updateParameter(parameter.id, {
            ...parameter,
            value: updatedArray,
        });
    };

    const handleUpdateArrayParameterName = (parameterId: string, newName: string) => {
        if (!parameter) return;
        if (!isArrayValue(parameter)) return;

        const updatedArray = parameter.value.map((item) => (item.id === parameterId ? { ...item, name: newName } : item));

        updateParameter(parameter.id, {
            ...parameter,
            value: updatedArray,
        });
    };

    const handleUpdateArrayParameterValue = (parameterId: string, newData: ParameterValue) => {
        if (!parameter) return;
        if (!isArrayValue(parameter)) return;

        const updatedArray = parameter.value.map((item) => {
            if (item.id !== parameterId) return item;

            return {
                ...item,
                data: newData,
            };
        });

        updateParameter(parameter.id, {
            ...parameter,
            value: updatedArray,
        });
    };

    return {
        handleAddArrayParameter,
        handleRemoveArrayParameter,
        handleUpdateArrayParameterName,
        handleUpdateArrayParameterValue,
    };
};
