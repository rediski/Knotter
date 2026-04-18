'use client';

import { useMemo, useState, useCallback, type MouseEvent } from 'react';

import type { Node } from '@/canvas/_core/_/canvas.types';
import type { Parameter } from '@/canvas/_core/_/parameter';

import { isStructure } from '@/canvas/_core/_/parameter.type-guards';
import { NODE_SHAPES } from '@/canvas/_core/_/nodeShapeType';
import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';

import { Input } from '@/components/UI/Input';
import { EmptyState } from '@/components/UI/EmptyState';

import { ParameterItem } from '@/canvas/_core/Node/ParameterItem';
import { CreateParameterForm } from '@/canvas/_core/Node/CreateParameterForm';
import { LocalParameter } from '@/canvas/_core/Node/LocalParameter';

import { getFilteredParameters } from '@/canvas/utils/parameters/getFilteredParameters';
import { addParameterToNode } from '@/canvas/utils/parameters/addParameterToNode';

import { Search, ArrowBigUp, ArrowBigDown, Plus, X } from 'lucide-react';

const toggleParameterSelection = (prevSet: Set<string>, id: string): Set<string> => {
    const newSet = new Set(prevSet);
    const wasDeleted = newSet.delete(id);

    if (!wasDeleted) {
        newSet.add(id);
    }

    return newSet;
};

export default function NodeContent() {
    const items = useItemsStore((state) => state.items);
    const parameters = useItemsStore((state) => state.parameters);
    const setParameters = useItemsStore((state) => state.setParameters);

    const selectedTabId = useCanvasStore((state) => state.selectedTabId);

    const [filterText, setFilterText] = useState('');
    const [selectedParameters, setSelectedParameters] = useState<Set<string>>(new Set());

    const node = items.find((item) => item.id === selectedTabId && item.kind === 'node');

    if (node?.kind !== 'node') return null;

    const currentNode = items.find((item) => item.kind === 'node' && item.id === node.id) as Node | undefined;
    const nodeParameters = currentNode?.parameters ?? [];

    const filteredParameters = useMemo(() => getFilteredParameters(parameters, filterText), [parameters, filterText]);

    const shapeInfo = NODE_SHAPES[node.shapeType as keyof typeof NODE_SHAPES];
    const Icon = shapeInfo?.icon;

    const getFlattenedParameterIds = useCallback((params: Parameter[], parametersMap: Map<string, Parameter>): string[] => {
        const ids: string[] = [];

        for (const param of params) {
            ids.push(param.id);
            if (isStructure(param)) {
                const children = param.data
                    .map((id) => parametersMap.get(id))
                    .filter((p): p is Parameter => p !== undefined);
                const childIds = getFlattenedParameterIds(children, parametersMap);
                ids.push(...childIds);
            }
        }

        return ids;
    }, []);

    const reorderParameters = useCallback((newOrderIds: string[], parametersMap: Map<string, Parameter>): Parameter[] => {
        const result: Parameter[] = [];
        const remainingIds = new Set(newOrderIds);

        for (const id of newOrderIds) {
            const param = parametersMap.get(id);
            if (!param) continue;

            if (isStructure(param)) {
                const childIds = param.data.filter((childId) => remainingIds.has(childId));

                const reorderedChildren = reorderParameters(childIds, parametersMap);

                result.push({
                    ...param,
                    data: reorderedChildren.map((c) => c.id),
                });

                childIds.forEach((id) => remainingIds.delete(id));
            } else {
                result.push(param);
            }

            remainingIds.delete(id);
        }

        return result;
    }, []);

    const getRangeSelection = useCallback(
        (currentId: string, lastSelectedId: string): Set<string> => {
            const parametersMap = new Map(parameters.map((p) => [p.id, p]));
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
        },
        [parameters, getFlattenedParameterIds],
    );

    const handleSelectParameter = useCallback(
        (id: string, ctrlKey: boolean, shiftKey: boolean) => {
            if (ctrlKey) {
                setSelectedParameters((prev) => toggleParameterSelection(prev, id));
                return;
            }

            if (shiftKey && selectedParameters.size > 0) {
                const lastSelectedId = Array.from(selectedParameters)[selectedParameters.size - 1];
                const newSet = getRangeSelection(id, lastSelectedId);

                if (newSet.size > 0) {
                    setSelectedParameters(newSet);
                }
                return;
            }

            setSelectedParameters(new Set([id]));
        },
        [selectedParameters, getRangeSelection],
    );

    const handleClearSelection = useCallback(() => {
        setSelectedParameters(new Set());
    }, []);

    const handleMoveUp = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation();
            if (selectedParameters.size === 0) return;

            const selectedParam = Array.from(selectedParameters)[0];
            const currentParam = parameters.find((p) => p.id === selectedParam);

            if (!currentParam) return;

            let siblingsIds: string[];

            if (currentParam.parentId) {
                const parent = parameters.find((p) => p.id === currentParam.parentId);

                if (!parent || !isStructure(parent)) return;
                siblingsIds = parent.data;
            } else {
                siblingsIds = filteredParameters.map((p) => p.id);
            }

            const currentIndex = siblingsIds.findIndex((id) => id === selectedParam);
            if (currentIndex <= 0) return;

            const newSiblingsIds = [...siblingsIds];
            [newSiblingsIds[currentIndex - 1], newSiblingsIds[currentIndex]] = [
                newSiblingsIds[currentIndex],
                newSiblingsIds[currentIndex - 1],
            ];

            if (currentParam.parentId) {
                const updatedParameters = parameters.map((param) => {
                    if (param.id === currentParam.parentId && isStructure(param)) {
                        return {
                            ...param,
                            data: newSiblingsIds,
                        };
                    }
                    return param;
                });

                setParameters(updatedParameters);
            } else {
                const otherParams = parameters.filter((p) => p.parentId !== null);
                const newRootParams = newSiblingsIds
                    .map((id) => parameters.find((p) => p.id === id))
                    .filter((p): p is Parameter => p !== undefined);
                setParameters([...newRootParams, ...otherParams]);
            }
        },
        [selectedParameters, parameters, setParameters, filteredParameters],
    );

    const handleMoveDown = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation();
            if (selectedParameters.size === 0) return;

            const selectedParam = Array.from(selectedParameters)[0];
            const currentParam = parameters.find((p) => p.id === selectedParam);
            if (!currentParam) return;

            let siblingsIds: string[];

            if (currentParam.parentId) {
                const parent = parameters.find((p) => p.id === currentParam.parentId);
                if (!parent || !isStructure(parent)) return;
                siblingsIds = parent.data;
            } else {
                siblingsIds = filteredParameters.map((p) => p.id);
            }

            const currentIndex = siblingsIds.findIndex((id) => id === selectedParam);
            if (currentIndex === siblingsIds.length - 1) return;

            const newSiblingsIds = [...siblingsIds];

            [newSiblingsIds[currentIndex], newSiblingsIds[currentIndex + 1]] = [
                newSiblingsIds[currentIndex + 1],
                newSiblingsIds[currentIndex],
            ];

            if (currentParam.parentId) {
                const updatedParameters = parameters.map((param) => {
                    if (param.id === currentParam.parentId && isStructure(param)) {
                        return {
                            ...param,
                            data: newSiblingsIds,
                        };
                    }
                    return param;
                });
                setParameters(updatedParameters);
            } else {
                const otherParams = parameters.filter((p) => p.parentId !== null);
                const newRootParams = newSiblingsIds
                    .map((id) => parameters.find((p) => p.id === id))
                    .filter((p): p is Parameter => p !== undefined);
                setParameters([...newRootParams, ...otherParams]);
            }
        },
        [selectedParameters, parameters, setParameters, filteredParameters],
    );

    const handleDeleteSelected = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation();
            if (selectedParameters.size === 0) return;

            const parametersMap = new Map(parameters.map((p) => [p.id, p]));

            const getIdsToDelete = (ids: Set<string>): Set<string> => {
                const toDelete = new Set(ids);

                for (const id of ids) {
                    const param = parametersMap.get(id);
                    if (param && isStructure(param)) {
                        const childIds = getIdsToDelete(new Set(param.data));
                        childIds.forEach((childId) => toDelete.add(childId));
                    }
                }

                return toDelete;
            };

            const idsToDelete = getIdsToDelete(selectedParameters);

            const newParameters = parameters.filter((p) => !idsToDelete.has(p.id));

            const cleanedParameters = newParameters.map((param) => {
                if (isStructure(param)) {
                    return {
                        ...param,
                        data: param.data.filter((id) => !idsToDelete.has(id)),
                    };
                }
                return param;
            });

            setParameters(cleanedParameters);
            setSelectedParameters(new Set());
        },
        [selectedParameters, parameters, setParameters],
    );

    const handleAddSelectedToNode = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (selectedParameters.size === 0) return;

            const selectedParams = parameters.filter((p) => selectedParameters.has(p.id));

            selectedParams.forEach((parameter) => {
                addParameterToNode(node.id, parameter.id);
            });

            setSelectedParameters(new Set());
        },
        [selectedParameters, parameters, node?.id],
    );

    const hasSelection = selectedParameters.size > 0;

    return (
        <div className="flex gap-1 w-full overflow-y-auto overflow-x-hidden" onClick={handleClearSelection}>
            <div className="flex flex-1 gap-1">
                <div className="flex flex-col gap-1">
                    <div
                        className={`flex items-center justify-center bg-depth-1 w-full max-h-64 max-w-64 min-w-64 aspect-square rounded-lg border border-depth-3 overflow-hidden`}
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, var(--grid-color-1) 1px, transparent 1px),
                                linear-gradient(to bottom, var(--grid-color-1) 1px, transparent 1px)
                            `,
                            backgroundSize: '64px 64px',
                            backgroundPosition: `-1.5px -1.5px`,
                            backgroundRepeat: 'repeat',
                        }}
                    >
                        <Icon
                            size={64}
                            className="flex items-center justify-center fill-depth-1"
                            strokeWidth={node.shapeType === 'point' ? 2 : 1.5}
                        />
                    </div>

                    <div className="flex flex-col max-w-64 h-fit bg-depth-1 border border-depth-3 rounded-md text-sm px-3 py-1">
                        <h2 className="wrap-break-word text-base">{node.name || '...'}</h2>
                        <p className="wrap-break-word text-gray text-sm">{node.description || '...'}</p>
                    </div>
                </div>

                <div className="flex flex-col w-full min-w-xl gap-1 text-sm">
                    {nodeParameters.length > 0 && (
                        <div className="flex flex-col gap-1 bg-depth-1 border border-depth-3 rounded-md p-1">
                            {nodeParameters.map((parameter) => (
                                <LocalParameter key={parameter.id} parameter={parameter} nodeId={node.id} />
                            ))}
                        </div>
                    )}

                    {nodeParameters.length === 0 && (
                        <div className="flex items-center justify-center h-full p-4 bg-depth-1 border border-depth-3 rounded-md">
                            <p className="text-sm text-gray">Нет добавленных параметров</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-1 flex-1">
                <div className="flex flex-col gap-1 p-1 bg-depth-1 border border-depth-3 rounded-md">
                    <div className="flex gap-1">
                        <Input
                            value={filterText}
                            onChange={setFilterText}
                            icon={Search}
                            placeholder="Фильтр..."
                            className="bg-depth-2 border border-depth-3 flex-1"
                        />
                    </div>

                    <CreateParameterForm />
                </div>

                <div className="flex flex-col flex-1 w-full h-fit overflow-y-auto bg-depth-1 border border-depth-3 rounded-md">
                    <div className="flex gap-1 sticky top-0 bg-depth-1 z-20 p-1 border-b border-depth-3">
                        <button
                            onClick={handleAddSelectedToNode}
                            disabled={!hasSelection}
                            className="flex flex-1 items-center justify-center w-8 h-8 p-1 bg-depth-2 hover:bg-depth-3 active:bg-depth-4 rounded-md border border-depth-3 disabled:opacity-30 cursor-pointer"
                            title="Добавить выбранные параметры в узел"
                        >
                            <Plus size={16} strokeWidth={3} />
                        </button>

                        <button
                            onClick={handleMoveUp}
                            disabled={!hasSelection}
                            className="flex flex-1 items-center justify-center w-8 h-8 p-1 bg-depth-2 hover:bg-depth-3 active:bg-depth-4 rounded-md border border-depth-3 disabled:opacity-30 cursor-pointer"
                            title="Переместить вверх"
                        >
                            <ArrowBigUp size={16} fill="var(--foreground)" stroke="var(--foreground)" />
                        </button>

                        <button
                            onClick={handleMoveDown}
                            disabled={!hasSelection}
                            className="flex flex-1 items-center justify-center w-8 h-8 p-1 bg-depth-2 hover:bg-depth-3 active:bg-depth-4 rounded-md border border-depth-3 disabled:opacity-30 cursor-pointer"
                            title="Переместить вниз"
                        >
                            <ArrowBigDown size={16} fill="var(--foreground)" stroke="var(--foreground)" />
                        </button>

                        <button
                            onClick={handleDeleteSelected}
                            disabled={!hasSelection}
                            className="flex flex-1 items-center justify-center w-8 h-8 p-1 bg-depth-2 hover:bg-depth-3 active:bg-depth-4 rounded-md border border-depth-3 disabled:opacity-30 cursor-pointer"
                            title="Удалить выбранные параметры"
                        >
                            <X size={16} strokeWidth={3} />
                        </button>
                    </div>

                    {filteredParameters.length > 0 && (
                        <div className="flex flex-col gap-1 p-1">
                            {filteredParameters.map((parameter) => (
                                <ParameterItem
                                    key={parameter.id}
                                    parameter={parameter}
                                    selectedIds={selectedParameters}
                                    onSelect={handleSelectParameter}
                                />
                            ))}
                        </div>
                    )}

                    {filteredParameters.length <= 0 && (
                        <EmptyState
                            message={
                                parameters.length === 0 ? 'Параметры не найдены' : 'Параметры с таким именем не найдены'
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
