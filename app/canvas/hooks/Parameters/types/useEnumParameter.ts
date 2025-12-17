import { Parameter, EnumConfig } from '@/canvas/utils/parameters/parameter.types';
import { isEnumValue } from '@/canvas/utils/parameters/parameter.type-guards';
import { v4 as uuid } from 'uuid';

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

        const newOption = {
            id: uuid(),
            name: `${ordinalNumber}.`,
            value: '',
        };

        updateParameter(parameter.id, {
            ...parameter,
            value: {
                ...thisParameterData,
                options: [...thisParameterData.options, newOption],
            },
        });
    };

    const handleRemoveEnumOption = (optionId: string) => {
        if (!parameter) return;
        if (!isEnumValue(parameter)) return;

        const thisParameterData = parameter.value as EnumConfig;

        const updatedOptions = thisParameterData.options.filter((option) => option.id !== optionId);

        updateParameter(parameter.id, {
            ...parameter,
            value: {
                ...thisParameterData,
                options: updatedOptions,
            },
        });
    };

    const handleUpdateEnumOptionName = (optionId: string, newName: string) => {
        if (!parameter) return;
        if (!isEnumValue(parameter)) return;

        const thisParameterData = parameter.value as EnumConfig;

        const updatedOptions = thisParameterData.options.map((option) =>
            option.id === optionId ? { ...option, name: newName } : option,
        );

        updateParameter(parameter.id, {
            ...parameter,
            value: {
                ...thisParameterData,
                options: updatedOptions,
            },
        });
    };

    const handleUpdateEnumOptionValue = (optionId: string, newValue: string) => {
        if (!parameter) return;
        if (!isEnumValue(parameter)) return;

        const thisParameterData = parameter.value as EnumConfig;

        const updatedOptions = thisParameterData.options.map((option) =>
            option.id === optionId ? { ...option, value: newValue } : option,
        );

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
        handleUpdateEnumOptionName,
        handleUpdateEnumOptionValue,
    };
};
