import type { Parameter } from '@/_core/_/parameter';

export const getFilteredParameters = (parameters: Parameter[], filterText?: string) => {
    const childIds = new Set<string>();

    let rootParameters = parameters.filter((parameter) => !childIds.has(parameter.id));

    if (filterText && filterText.trim()) {
        const searchText = filterText.toLowerCase();
        rootParameters = rootParameters.filter((parameter) => parameter.name.toLowerCase().includes(searchText));
    }

    return rootParameters;
};
