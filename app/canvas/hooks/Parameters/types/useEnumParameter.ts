import { Parameter, EnumConfig } from '@/canvas/utils/parameters/parameter.types';
import { isEnumValue } from '@/canvas/utils/parameters/parameter.type-guards';

interface useEnumParameterProps {
    parameter: Parameter | undefined;
    updateParameter: (parameterId: string, updates: Partial<Parameter>) => void;
}

export const useEnumParameter = ({ parameter, updateParameter }: useEnumParameterProps) => {
    const handleAddEnumOption = () => {
        if (!parameter) return;
        if (!isEnumValue(parameter)) return;

        const thisParameterData = parameter.value as EnumConfig;
        const ordinalNumber = thisParameterData.options.length + 1;

        let newValue = `Опция ${ordinalNumber}`;
        let counter = 1;

        while (thisParameterData.options.includes(newValue)) {
            newValue = `Опция ${ordinalNumber} (${counter})`;
            counter++;
        }

        updateParameter(parameter.id, {
            ...parameter,
            value: {
                ...thisParameterData,
                options: [...thisParameterData.options, newValue],
            },
        });
    };

    const handleRemoveEnumOption = (index: number) => {
        if (!parameter) return;
        if (!isEnumValue(parameter)) return;

        const thisParameterData = parameter.value as EnumConfig;
        const updatedOptions = thisParameterData.options.filter((_, i) => i !== index);

        updateParameter(parameter.id, {
            ...parameter,
            value: {
                ...thisParameterData,
                options: updatedOptions,
            },
        });
    };

    const handleUpdateEnumOption = (index: number, newValue: string) => {
        if (!parameter) return;
        if (!isEnumValue(parameter)) return;

        const thisParameterData = parameter.value as EnumConfig;

        if (thisParameterData.options.some((option, i) => i !== index && option === newValue)) {
            return;
        }

        const updatedOptions = thisParameterData.options.map((option, i) => (i === index ? newValue : option));

        updateParameter(parameter.id, {
            ...parameter,
            value: {
                ...thisParameterData,
                options: updatedOptions,
            },
        });
    };

    return {
        handleAddEnumOption,
        handleRemoveEnumOption,
        handleUpdateEnumOption,
    };
};
