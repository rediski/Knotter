import { useMemo, useState, useCallback, type MouseEvent } from 'react';

import type { Parameter } from '@/_core/_/parameter';

import { isStructure } from '@/_core/_/parameter.type-guards';

import { useItemsStore } from '@/store/useItemsStore';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

import { getFilteredParameters } from '@/utils/parameters/getFilteredParameters';
import { getRangeSelection } from '@/utils/canvas/getRangeSelection';

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

    const handleDragReorder = useCallback(
        (newParameters: Parameter[]) => {
            const firstSelectedId = Array.from(selectedParameters)[0];
            if (!firstSelectedId) return;

            const firstParameter = parameters.find((p) => p.id === firstSelectedId);
            if (!firstParameter) return;

            const newSiblingsIds = newParameters
                .filter((p) => {
                    if (firstParameter.parentId) {
                        return p.parentId === firstParameter.parentId;
                    }
                    return p.parentId === null;
                })
                .map((p) => p.id);

            updateSiblingsOrder(parameters, firstParameter, newSiblingsIds, setParameters);
        },
        [parameters, selectedParameters, setParameters],
    );

    const { draggingId, insertPosition, listRef, handleDragStart, handleDragOver, handleDrop, handleDragEnd } =
        useDragAndDrop<Parameter>({
            filteredItems: filteredParameters,
            items: parameters,
            selectedIds: Array.from(selectedParameters),
            onSelect: (ids) => setSelectedParameters(new Set(ids)),
            onReorder: handleDragReorder,
        });

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

    const clearSelection = useCallback(() => {
        setSelectedParameters(new Set());
    }, [setSelectedParameters]);

    const selectParameters = useCallback(
        (id: string, ctrlKey: boolean, shiftKey: boolean) => {
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
        },
        [selectedParameters, filteredParameters, setSelectedParameters],
    );

    return {
        filteredParameters,
        parameters,
        filterText,
        selectedParameters,

        setFilterText,

        selectParameters,
        clearSelection,
        deleteSelectedParameters,

        draggingId,
        insertPosition,
        listRef,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
    };
};
