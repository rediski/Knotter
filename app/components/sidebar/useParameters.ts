import { useMemo, useState, useCallback, type MouseEvent } from 'react';

import type { Parameter } from '@/_core/_/parameter';

import { useItemsStore } from '@/store/useItemsStore';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

import { getFilteredParameters } from '@/utils/parameters/getFilteredParameters';
import { getRangeSelection } from '@/utils/canvas/getRangeSelection';

const updateSiblingsOrder = (
    parameters: Parameter[],
    currentParameter: Parameter,
    newSiblingsIds: string[],
    setParameters: (params: Parameter[]) => void,
) => {
    if (currentParameter.parentId) {
        const updatedParameters = parameters.map((parameter) => {
            if (parameter.id === currentParameter.parentId) {
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

const getIdsToDelete = (ids: string[], parametersMap: Map<string, Parameter>): Set<string> => {
    const toDelete = new Set(ids);
    const stack = Array.from(ids);

    while (stack.length) {
        const currentId = stack.pop()!;
        const parameter = parametersMap.get(currentId);

        if (parameter) {
            for (const childId of parameter.defaultValue as string[]) {
                if (!toDelete.has(childId)) {
                    toDelete.add(childId);
                    stack.push(childId);
                }
            }
        }
    }

    return toDelete;
};

const ensureArray = (value: any): string[] => {
    if (Array.isArray(value)) return value;
    if (value instanceof Set) return Array.from(value);
    if (value === null || value === undefined) return [];
    return [];
};

export const useParameters = () => {
    const parameters = useItemsStore((state) => state.parameters);
    const setParameters = useItemsStore((state) => state.setParameters);
    const rawSelectedParameters = useItemsStore((state) => state.selectedParameters);
    const setSelectedParameters = useItemsStore((state) => state.setSelectedParameters);

    const selectedParameters = useMemo(() => ensureArray(rawSelectedParameters), [rawSelectedParameters]);

    const [filterText, setFilterText] = useState('');

    const filteredParameters = useMemo(() => getFilteredParameters(parameters, filterText), [parameters, filterText]);

    const handleDragReorder = useCallback(
        (newParameters: Parameter[]) => {
            const firstSelectedId = selectedParameters[0];
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

    const { listRef, handleDragStart, handleDragOver, handleDrop, handleDragEnd } = useDragAndDrop<Parameter>({
        filteredItems: filteredParameters,
        items: parameters,
        selectedIds: selectedParameters,
        onSelect: (ids) => setSelectedParameters(ids),
        onReorder: handleDragReorder,
        itemSelector: 'li',
    });

    const deleteSelectedParameters = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation();

            if (selectedParameters.length === 0) return;

            const parametersMap = new Map(parameters.map((parameter) => [parameter.id, parameter]));
            const idsToDelete = getIdsToDelete(selectedParameters, parametersMap);

            const newParameters = parameters.filter((parameter) => !idsToDelete.has(parameter.id));

            const cleanedParameters = newParameters.map((parameter) => {
                return parameter;
            });

            setParameters(cleanedParameters);
            setSelectedParameters([]);
        },
        [parameters, selectedParameters, setParameters, setSelectedParameters],
    );

    const selectParameters = useCallback(
        (id: string, ctrlKey: boolean, shiftKey: boolean) => {
            if (ctrlKey) {
                const newArray = [...selectedParameters];
                const index = newArray.indexOf(id);

                if (index >= 0) {
                    newArray.splice(index, 1);
                    setSelectedParameters(newArray);
                    return;
                }

                newArray.push(id);
                setSelectedParameters(newArray);
                return;
            }

            if (shiftKey && selectedParameters.length > 0) {
                const lastSelectedId = selectedParameters[selectedParameters.length - 1];
                const rangeSet = getRangeSelection(filteredParameters, id, lastSelectedId);
                if (rangeSet.size > 0) {
                    setSelectedParameters(Array.from(rangeSet));
                }
                return;
            }

            setSelectedParameters([id]);
        },
        [selectedParameters, filteredParameters, setSelectedParameters],
    );

    const deselect = useCallback(
        (e: React.MouseEvent<HTMLUListElement>) => {
            if (e.target === e.currentTarget) {
                setSelectedParameters([]);
            }
        },
        [setSelectedParameters],
    );

    const visibleSelectedCount = useMemo(() => {
        return filteredParameters.filter((p) => selectedParameters.includes(p.id)).length;
    }, [filteredParameters, selectedParameters]);

    return {
        filteredParameters,
        filterText,
        selectedParameters,
        setFilterText,
        selectParameters,
        deleteSelectedParameters,
        deselect,
        visibleSelectedCount,
        listRef,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
    };
};
