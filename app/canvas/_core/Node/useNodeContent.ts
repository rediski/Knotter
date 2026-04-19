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

    for (const parameter of parameters) {
        ids.push(parameter.id);

        if (isStructure(parameter)) {
            const children = parameter.data
                .map((id) => parametersMap.get(id))
                .filter((parameter): parameter is Parameter => parameter !== undefined);
            const childIds = getFlattenedParameterIds(children, parametersMap);
            ids.push(...childIds);
        }
    }

    return ids;
};

const getSiblingsIds = (parameters: Parameter[], currentParameter: Parameter, filteredParameters: Parameter[]): string[] => {
    if (currentParameter.parentId) {
        const parent = parameters.find((parameter) => parameter.id === currentParameter.parentId);

        if (!parent || !isStructure(parent)) return [];

        return parent.data;
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
                return { ...parameter, data: newSiblingsIds };
            }

            return parameter;
        });

        setParameters(updatedParameters);
        return;
    }

    const otherParams = parameters.filter((parameter) => parameter.parentId !== null);

    const newRootParams = newSiblingsIds
        .map((id) => parameters.find((parameter) => parameter.id === id))
        .filter((parameter): parameter is Parameter => parameter !== undefined);

    setParameters([...newRootParams, ...otherParams]);
};

const getIdsToDelete = (ids: Set<string>, parametersMap: Map<string, Parameter>): Set<string> => {
    const toDelete = new Set(ids);

    for (const id of ids) {
        const parameter = parametersMap.get(id);

        if (parameter && isStructure(parameter)) {
            const childIds = getIdsToDelete(new Set(parameter.data), parametersMap);
            childIds.forEach((childId) => toDelete.add(childId));
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

    const handleSelectParameter = (id: string, ctrlKey: boolean, shiftKey: boolean) => {
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

    const handleClearSelection = () => {
        setSelectedParameters(new Set());
    };

    const moveParameter = (direction: 'up' | 'down') => {
        if (selectedParameters.size === 0) return;

        const selectedParameter = Array.from(selectedParameters)[0];
        const currentParameter = parameters.find((p) => p.id === selectedParameter);
        if (!currentParameter) return;

        const siblingsIds = getSiblingsIds(parameters, currentParameter, filteredParameters);
        if (siblingsIds.length === 0) return;

        const currentIndex = siblingsIds.findIndex((id) => id === selectedParameter);

        if (direction === 'up' && currentIndex <= 0) return;
        if (direction === 'down' && currentIndex === siblingsIds.length - 1) return;

        const newSiblingsIds = [...siblingsIds];
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        [newSiblingsIds[currentIndex], newSiblingsIds[newIndex]] = [newSiblingsIds[newIndex], newSiblingsIds[currentIndex]];

        updateSiblingsOrder(parameters, currentParameter, newSiblingsIds, setParameters);
    };

    const handleMoveUp = (e: MouseEvent) => {
        e.stopPropagation();
        moveParameter('up');
    };

    const handleMoveDown = (e: MouseEvent) => {
        e.stopPropagation();
        moveParameter('down');
    };

    const handleDeleteSelected = (e: MouseEvent) => {
        e.stopPropagation();

        if (selectedParameters.size === 0) return;

        const parametersMap = new Map(parameters.map((parameter) => [parameter.id, parameter]));
        const idsToDelete = getIdsToDelete(selectedParameters, parametersMap);

        const newParameters = parameters.filter((parameter) => !idsToDelete.has(parameter.id));

        const cleanedParameters = newParameters.map((parameter) => {
            if (isStructure(parameter)) {
                return {
                    ...parameter,
                    data: parameter.data.filter((id) => !idsToDelete.has(id)),
                };
            }

            return parameter;
        });

        setParameters(cleanedParameters);
        setSelectedParameters(new Set());
    };

    const handleAddSelectedToNode = (e: MouseEvent) => {
        e.stopPropagation();
        if (!node || selectedParameters.size === 0) return;

        const selectedParams = parameters.filter((parameter) => selectedParameters.has(parameter.id));

        selectedParams.forEach((parameter) => {
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

        handleSelectParameter,
        handleClearSelection,
        handleMoveUp,
        handleMoveDown,
        handleDeleteSelected,
        handleAddSelectedToNode,
    };
};
