import { Parameter } from '@/canvas/_core/_/parameter';
import { updateParameter } from '@/canvas/utils/parameters/updateParameter';
import { isEnum } from '@/canvas/_core/_/parameter.type-guards';

export const useEnum = ({ parameter }: { parameter: Parameter }) => {
    const addEnumOption = () => {
        if (!parameter) return;
        if (!isEnum(parameter)) return;

        const currentValue = parameter.defaultValue as string[];
        const ordinalNumber = currentValue.length + 1;

        let newOption = `Опция ${ordinalNumber}`;
        let counter = 1;

        while (currentValue.includes(newOption)) {
            newOption = `Опция ${ordinalNumber} (${counter})`;
            counter++;
        }

        updateParameter(parameter.id, {
            ...parameter,
            defaultValue: [...currentValue, newOption],
        });
    };

    const removeEnumOption = (index: number) => {
        if (!parameter) return;
        if (!isEnum(parameter)) return;

        const currentValue = parameter.defaultValue as string[];
        const updatedOptions = currentValue.filter((_, i) => i !== index);

        updateParameter(parameter.id, {
            ...parameter,
            defaultValue: updatedOptions,
        });
    };

    const updateEnumOption = (index: number, newValue: string) => {
        if (!parameter) return;
        if (!isEnum(parameter)) return;

        const currentValue = parameter.defaultValue as string[];

        if (currentValue.some((option, i) => i !== index && option === newValue)) {
            return;
        }

        const updatedOptions = currentValue.map((option, i) => (i === index ? newValue : option));

        updateParameter(parameter.id, {
            ...parameter,
            defaultValue: updatedOptions,
        });
    };

    return {
        addEnumOption,
        removeEnumOption,
        updateEnumOption,
    };
};
