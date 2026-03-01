import { Parameter, ParameterTypeMap } from '@/canvas/_core/_/parameter';
import { updateParameter } from '@/canvas/utils/parameters/updateParameter';
import { isEnum } from '@/canvas/_core/_/parameter.type-guards';

export const useEnum = ({ parameter }: { parameter: Parameter | undefined }) => {
    const handleAddEnumOption = () => {
        if (!parameter) return;
        if (!isEnum(parameter)) return;

        const thisParameterData = parameter.data as ParameterTypeMap['enum'];
        const ordinalNumber = thisParameterData.options.length + 1;

        let newValue = `Опция ${ordinalNumber}`;
        let counter = 1;

        while (thisParameterData.options.includes(newValue)) {
            newValue = `Опция ${ordinalNumber} (${counter})`;
            counter++;
        }

        updateParameter(parameter.id, {
            ...parameter,
            data: {
                ...thisParameterData,
                options: [...thisParameterData.options, newValue],
            },
        });
    };

    const handleRemoveEnumOption = (index: number) => {
        if (!parameter) return;
        if (!isEnum(parameter)) return;

        const thisParameterData = parameter.data as ParameterTypeMap['enum'];
        const updatedOptions = thisParameterData.options.filter((_, i) => i !== index);

        updateParameter(parameter.id, {
            ...parameter,
            data: {
                ...thisParameterData,
                options: updatedOptions,
            },
        });
    };

    const handleUpdateEnumOption = (index: number, newValue: string) => {
        if (!parameter) return;
        if (!isEnum(parameter)) return;

        const thisParameterData = parameter.data as ParameterTypeMap['enum'];

        if (thisParameterData.options.some((option, i) => i !== index && option === newValue)) {
            return;
        }

        const updatedOptions = thisParameterData.options.map((option, i) => (i === index ? newValue : option));

        updateParameter(parameter.id, {
            ...parameter,
            data: {
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
