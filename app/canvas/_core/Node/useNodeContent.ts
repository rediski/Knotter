import { useMemo, useState, type MouseEvent } from 'react';

import type { Node } from '@/canvas/_core/_/canvas.types';
import type { Parameter } from '@/canvas/_core/_/parameter';

import { isStructure } from '@/canvas/_core/_/parameter.type-guards';
import { NODE_SHAPES } from '@/canvas/_core/_/nodeShapeType';

import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';

import { getFilteredParameters } from '@/canvas/utils/parameters/getFilteredParameters';
import { addParameterToNode } from '@/canvas/utils/parameters/addParameterToNode';

const toggleParameterSelection = (prevSet: Set<string>, id: string): Set<string> => {
    const newSet = new Set(prevSet);
    const wasDeleted = newSet.delete(id);

    if (!wasDeleted) {
        newSet.add(id);
    }

    return newSet;
};

const getFlattenedParameterIds = (parameters: Parameter[], parametersMap: Map<string, Parameter>): string[] => {
    const ids: string[] = [];
    const stack = [...parameters];

    while (stack.length) {
        const parameter = stack.pop()!;
        ids.push(parameter.id);

        if (isStructure(parameter)) {
            for (const id of parameter.value) {
                const child = parametersMap.get(id);
                if (child) stack.push(child);
            }
        }
    }

    return ids;
};

const getSiblingsIds = (parameters: Parameter[], currentParameter: Parameter, filteredParameters: Parameter[]): string[] => {
    if (currentParameter.parentId) {
        const parent = parameters.find((parameter) => parameter.id === currentParameter.parentId);

        if (!parent || !isStructure(parent)) return [];

        return parent.value;
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
                return { ...parameter, value: newSiblingsIds };
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
            for (const childId of parameter.value) {
                if (!toDelete.has(childId)) {
                    toDelete.add(childId);
                    stack.push(childId);
                }
            }
        }
    }

    return toDelete;
};

const getRangeSelection = (parameters: Parameter[], currentId: string, lastSelectedId: string): Set<string> => {
    const parametersMap = new Map(parameters.map((parameter) => [parameter.id, parameter]));
    const flatIds = getFlattenedParameterIds(parameters, parametersMap);

    const currentIndex = flatIds.findIndex((id) => id === currentId);
    const lastIndex = flatIds.findIndex((id) => id === lastSelectedId);

    if (currentIndex === -1 || lastIndex === -1) {
        return new Set();
    }

    const start = Math.min(currentIndex, lastIndex);
    const end = Math.max(currentIndex, lastIndex);
    const newSet = new Set<string>();

    for (let i = start; i <= end; i++) {
        newSet.add(flatIds[i]);
    }

    return newSet;
};

export const useNodeContent = () => {
    const items = useItemsStore((state) => state.items);
    const parameters = useItemsStore((state) => state.parameters);
    const setParameters = useItemsStore((state) => state.setParameters);
    const selectedTabId = useCanvasStore((state) => state.selectedTabId);

    const [filterText, setFilterText] = useState('');
    const [selectedParameters, setSelectedParameters] = useState<Set<string>>(new Set());

    const node = useMemo(
        () => items.find((item): item is Node => item.id === selectedTabId && item.kind === 'node'),
        [items, selectedTabId],
    );

    const nodeParameters = node?.parameters ?? [];
    const filteredParameters = useMemo(() => getFilteredParameters(parameters, filterText), [parameters, filterText]);

    const shapeInfo = node ? NODE_SHAPES[node.shapeType as keyof typeof NODE_SHAPES] : undefined;
    const Icon = shapeInfo?.icon;

    const selectParameters = (id: string, ctrlKey: boolean, shiftKey: boolean) => {
        if (ctrlKey) {
            setSelectedParameters((prev) => toggleParameterSelection(prev, id));
            return;
        }

        if (shiftKey && selectedParameters.size > 0) {
            const lastSelectedId = Array.from(selectedParameters)[selectedParameters.size - 1];
            const newSet = getRangeSelection(parameters, id, lastSelectedId);

            if (newSet.size > 0) {
                setSelectedParameters(newSet);
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
                    value: parameter.value.filter((id) => !idsToDelete.has(id)),
                };
            }

            return parameter;
        });

        setParameters(cleanedParameters);
        setSelectedParameters(new Set());
    };

    const addParametersToNode = (e: MouseEvent) => {
        e.stopPropagation();
        if (!node || selectedParameters.size === 0) return;

        const selectedParametersList = parameters.filter((parameter) => selectedParameters.has(parameter.id));

        selectedParametersList.forEach((parameter) => {
            addParameterToNode(node.id, parameter.id);
        });

        setSelectedParameters(new Set());
    };

    const hasSelection = selectedParameters.size > 0;

    return {
        node,
        nodeParameters,
        filteredParameters,
        parameters,
        filterText,
        selectedParameters,
        hasSelection,
        Icon,

        setFilterText,

        selectParameters,
        clearSelection,
        moveSelectedParametersUp,
        moveSelectedParametersDown,
        deleteSelectedParameters,
        addParametersToNode,
    };
};
