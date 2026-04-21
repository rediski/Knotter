import type { Parameter } from '@/canvas/_core/_/parameter';
import { isStructure } from '@/canvas/_core/_/parameter.type-guards';

export const getFilteredParameters = (parameters: Parameter[], filterText?: string) => {
    const childIds = new Set<string>();

    for (const parameter of parameters) {
        if (isStructure(parameter)) {
            parameter.value.forEach((id) => childIds.add(id));
        }
    }

    let rootParameters = parameters.filter((parameter) => !childIds.has(parameter.id));

    if (filterText && filterText.trim()) {
        const searchText = filterText.toLowerCase();
        rootParameters = rootParameters.filter((parameter) => parameter.name.toLowerCase().includes(searchText));
    }

    return rootParameters;
};
