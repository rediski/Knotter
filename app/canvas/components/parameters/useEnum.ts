import { Parameter } from '@/canvas/_core/_/parameter';
import { updateParameter } from '@/canvas/utils/parameters/updateParameter';
import { isEnum } from '@/canvas/_core/_/parameter.type-guards';

export const useEnum = ({ parameter }: { parameter: Parameter | undefined }) => {
    const addEnumOption = () => {
        if (!parameter) return;
        if (!isEnum(parameter)) return;

        let parameterDefaultValue = parameter.defaultValue;

        if (!parameterDefaultValue || !parameterDefaultValue.options) {
            parameterDefaultValue = { value: null, options: [] };
        }

        const ordinalNumber = parameterDefaultValue.options.length + 1;

        let newValue = `Опция ${ordinalNumber}`;
        let counter = 1;

        while (parameterDefaultValue.options.includes(newValue)) {
            newValue = `Опция ${ordinalNumber} (${counter})`;
            counter++;
        }

        updateParameter(parameter.id, {
            ...parameter,
            defaultValue: {
                ...parameterDefaultValue,
                options: [...parameterDefaultValue.options, newValue],
            },
        });
    };

    const removeEnumOption = (index: number) => {
        if (!parameter) return;
        if (!isEnum(parameter)) return;

        let parameterDefaultValue = parameter.defaultValue;

        if (!parameterDefaultValue || !parameterDefaultValue.options) {
            parameterDefaultValue = { value: null, options: [] };
        }

        const updatedOptions = parameterDefaultValue.options.filter((_, i) => i !== index);

        updateParameter(parameter.id, {
            ...parameter,
            defaultValue: {
                ...parameterDefaultValue,
                options: updatedOptions,
            },
        });
    };

    const updateEnumOption = (index: number, newValue: string) => {
        if (!parameter) return;
        if (!isEnum(parameter)) return;

        let parameterDefaultValue = parameter.defaultValue;

        if (!parameterDefaultValue || !parameterDefaultValue.options) {
            parameterDefaultValue = { value: null, options: [] };
        }

        if (parameterDefaultValue.options.some((option, i) => i !== index && option === newValue)) {
            return;
        }

        const updatedOptions = parameterDefaultValue.options.map((option, i) => (i === index ? newValue : option));

        updateParameter(parameter.id, {
            ...parameter,
            defaultValue: {
                ...parameterDefaultValue,
                options: updatedOptions,
            },
        });
    };

    return {
        addEnumOption,
        removeEnumOption,
        updateEnumOption,
    };
};
