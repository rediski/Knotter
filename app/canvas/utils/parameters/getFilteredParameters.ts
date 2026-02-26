import type { Parameter } from '@/canvas/_core/_/parameter';

export const getFilteredParameters = (parameters: Parameter[], filterText?: string) => {
    if (!filterText) return parameters;

    const searchText = filterText.toLowerCase();

    const filteredParameters = parameters.filter((parameter) => {
        return parameter.name.toLowerCase().includes(searchText) || parameter.type.toLowerCase().includes(searchText);
    });

    return filteredParameters;
};
