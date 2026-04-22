import { Parameter } from '@/canvas/_core/_/parameter';
import { updateParameter } from '@/canvas/utils/parameters/updateParameter';
import { isEnum } from '@/canvas/_core/_/parameter.type-guards';

export const useEnum = ({ parameter }: { parameter: Parameter }) => {
    const addEnumOption = () => {
        if (!parameter) return;
        if (!isEnum(parameter)) return;

        const currentValue = parameter.value as { selected: string | null; options: string[] };
        const ordinalNumber = currentValue.options.length + 1;

        let newOption = `Опция ${ordinalNumber}`;
        let counter = 1;

        while (currentValue.options.includes(newOption)) {
            newOption = `Опция ${ordinalNumber} (${counter})`;
            counter++;
        }

        updateParameter(parameter.id, {
            ...parameter,
            value: {
                ...currentValue,
                options: [...currentValue.options, newOption],
            },
        });
    };

    const removeEnumOption = (index: number) => {
        if (!parameter) return;
        if (!isEnum(parameter)) return;

        const currentValue = parameter.value as { selected: string | null; options: string[] };
        const updatedOptions = currentValue.options.filter((_, i) => i !== index);

        const newSelected =
            currentValue.selected && updatedOptions.includes(currentValue.selected) ? currentValue.selected : null;

        updateParameter(parameter.id, {
            ...parameter,
            value: {
                ...currentValue,
                options: updatedOptions,
                selected: newSelected,
            },
        });
    };

    const updateEnumOption = (index: number, newValue: string) => {
        if (!parameter) return;
        if (!isEnum(parameter)) return;

        const currentValue = parameter.value as { selected: string | null; options: string[] };

        if (currentValue.options.some((option, i) => i !== index && option === newValue)) {
            return;
        }

        const updatedOptions = currentValue.options.map((option, i) => (i === index ? newValue : option));

        const newSelected = currentValue.selected === currentValue.options[index] ? newValue : currentValue.selected;

        updateParameter(parameter.id, {
            ...parameter,
            value: {
                ...currentValue,
                options: updatedOptions,
                selected: newSelected,
            },
        });
    };

    return {
        addEnumOption,
        removeEnumOption,
        updateEnumOption,
    };
};
