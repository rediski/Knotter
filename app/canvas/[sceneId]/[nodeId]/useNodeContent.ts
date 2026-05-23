import { useMemo, useState, type MouseEvent } from 'react';

import type { Parameter } from '@/canvas/_core/_/parameter';

import { isStructure } from '@/canvas/_core/_/parameter.type-guards';

import { useItemsStore } from '@/canvas/store/useItemsStore';

import { getFilteredParameters } from '@/canvas/utils/parameters/getFilteredParameters';
import { getRangeSelection } from '@/canvas/utils/canvas/getRangeSelection';

const getSiblingsIds = (parameters: Parameter[], currentParameter: Parameter, filteredParameters: Parameter[]): string[] => {
    if (currentParameter.parentId) {
        const parent = parameters.find((parameter) => parameter.id === currentParameter.parentId);

        if (!parent || !isStructure(parent)) return [];

        return parent.defaultValue;
    }

    return filteredParameters.map((parameter) => parameter.id);
};

const updateSiblingsOrder = (
    parameters: Parameter[],
    currentParameter: Parameter,
    newSiblingsIds: string[],
    setParameters: (params: Parameter[]) => void,
) => {
    if (currentParameter.parentId) {
        const updatedParameters = parameters.map((parameter) => {
            if (parameter.id === currentParameter.parentId && isStructure(parameter)) {
                return { ...parameter, defaultValue: newSiblingsIds };
            }

            return parameter;
        });

        setParameters(updatedParameters);
        return;
    }

    const otherParameters = parameters.filter((parameter) => parameter.parentId !== null);

    const newRootParameters = newSiblingsIds
        .map((id) => parameters.find((parameter) => parameter.id === id))
        .filter((parameter): parameter is Parameter => parameter !== undefined);

    setParameters([...newRootParameters, ...otherParameters]);
};

const getIdsToDelete = (ids: Set<string>, parametersMap: Map<string, Parameter>): Set<string> => {
    const toDelete = new Set(ids);
    const stack = Array.from(ids);

    while (stack.length) {
        const currentId = stack.pop()!;
        const parameter = parametersMap.get(currentId);

        if (parameter && isStructure(parameter)) {
            for (const childId of parameter.defaultValue) {
                if (!toDelete.has(childId)) {
                    toDelete.add(childId);
                    stack.push(childId);
                }
            }
        }
    }

    return toDelete;
};

export const useNodeContent = () => {
    const parameters = useItemsStore((state) => state.parameters);
    const setParameters = useItemsStore((state) => state.setParameters);
    const selectedParameters = useItemsStore((state) => state.selectedParameters);
    const setSelectedParameters = useItemsStore((state) => state.setSelectedParameters);

    const [filterText, setFilterText] = useState('');

    const filteredParameters = useMemo(() => getFilteredParameters(parameters, filterText), [parameters, filterText]);

    const selectParameters = (id: string, ctrlKey: boolean, shiftKey: boolean) => {
        if (ctrlKey) {
            const newSet = new Set(selectedParameters);
            const wasDeleted = newSet.delete(id);

            if (!wasDeleted) {
                newSet.add(id);
            }

            setSelectedParameters(newSet);
            return;
        }

        if (shiftKey && selectedParameters.size > 0) {
            const lastSelectedId = Array.from(selectedParameters)[selectedParameters.size - 1];
            const rangeSet = getRangeSelection(filteredParameters, id, lastSelectedId);

            if (rangeSet.size > 0) {
                setSelectedParameters(rangeSet);
            }

            return;
        }

        setSelectedParameters(new Set([id]));
    };

    const clearSelection = () => {
        setSelectedParameters(new Set());
    };

    const moveSelectedParameters = (direction: 'up' | 'down') => {
        if (selectedParameters.size === 0) return;

        const selectedIds = Array.from(selectedParameters);
        const selectedParametersList = selectedIds
            .map((id) => parameters.find((parameter) => parameter.id === id))
            .filter((parameter): parameter is Parameter => parameter !== undefined);

        if (selectedParametersList.length === 0) return;

        const firstParameter = selectedParametersList[0];
        const siblingsIds = getSiblingsIds(parameters, firstParameter, filteredParameters);
        if (siblingsIds.length === 0) return;

        const selectedIndices = selectedIds
            .map((id) => siblingsIds.findIndex((siblingId) => siblingId === id))
            .filter((index) => index !== -1)
            .sort((a, b) => a - b);

        if (selectedIndices.length === 0) return;

        if (direction === 'up' && selectedIndices[0] <= 0) return;
        if (direction === 'down' && selectedIndices[selectedIndices.length - 1] === siblingsIds.length - 1) return;

        const newSiblingsIds = [...siblingsIds];

        if (direction === 'up') {
            const firstIndex = selectedIndices[0];
            const movedElement = newSiblingsIds[firstIndex - 1];

            newSiblingsIds.splice(firstIndex - 1, 1);
            newSiblingsIds.splice(selectedIndices[selectedIndices.length - 1], 0, movedElement);
        }

        if (direction === 'down') {
            const lastIndex = selectedIndices[selectedIndices.length - 1];
            const movedElement = newSiblingsIds[lastIndex + 1];

            newSiblingsIds.splice(lastIndex + 1, 1);
            newSiblingsIds.splice(selectedIndices[0], 0, movedElement);
        }

        updateSiblingsOrder(parameters, firstParameter, newSiblingsIds, setParameters);
    };

    const moveSelectedParametersUp = (e: MouseEvent) => {
        e.stopPropagation();
        moveSelectedParameters('up');
    };

    const moveSelectedParametersDown = (e: MouseEvent) => {
        e.stopPropagation();
        moveSelectedParameters('down');
    };

    const deleteSelectedParameters = (e: MouseEvent) => {
        e.stopPropagation();

        if (selectedParameters.size === 0) return;

        const parametersMap = new Map(parameters.map((parameter) => [parameter.id, parameter]));
        const idsToDelete = getIdsToDelete(selectedParameters, parametersMap);

        const newParameters = parameters.filter((parameter) => !idsToDelete.has(parameter.id));

        const cleanedParameters = newParameters.map((parameter) => {
            if (isStructure(parameter)) {
                return {
                    ...parameter,
                    defaultValue: parameter.defaultValue.filter((id: string) => !idsToDelete.has(id)),
                };
            }

            return parameter;
        });

        setParameters(cleanedParameters);
        setSelectedParameters(new Set());
    };

    return {
        filteredParameters,
        parameters,
        filterText,
        selectedParameters,

        setFilterText,

        selectParameters,
        clearSelection,
        moveSelectedParametersUp,
        moveSelectedParametersDown,
        deleteSelectedParameters,
    };
};
