'use client';

import { memo, type MouseEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { CanvasItem, Node } from '@/_core/_/canvas.types';
import type { Parameter } from '@/_core/_/parameter';

import { useItemsStore } from '@/store/useItemsStore';

import { openNodeTab } from '@/utils/nodes/openNodeTab';

import { useDragAndDrop } from '@/hooks/useDragAndDrop';

import { ChevronDown, ChevronRight, LineSquiggle, Package, PackageOpen, ScanBox } from 'lucide-react';

interface HierarchyItemProps {
    item: CanvasItem | Parameter;
    index: number;
    totalItems: number;
    selectItem?: (id: string, ctrlKey: boolean, shiftKey: boolean) => void;
    isSelected?: boolean;
    handleDragStart?: (e: React.DragEvent, nodeId: string) => void;
    selectedItemIds?: string[];
    isParameter?: boolean;
}

export const HierarchyItem = memo(function HierarchyItem({
    item,
    index,
    totalItems,
    selectItem,
    isSelected = false,
    handleDragStart,
    selectedItemIds = [],
    isParameter = false,
}: HierarchyItemProps) {
    const router = useRouter();

    const [isExpanded, setIsExpanded] = useState(true);

    const currentNodeId = useItemsStore((state) => state.currentNodeId);

    if (isParameter) {
        const parameter = item as Parameter;

        const isLast = index === totalItems - 1;

        const LINE_LEFT = 38.8;
        const LINE_WIDTH = 16;

        return (
            <li
                data-parameter-id={parameter.id}
                className="relative select-none cursor-grab"
                draggable
                onDragStart={(e) => handleDragStart?.(e, parameter.id)}
            >
                <div
                    className="absolute border-l border-depth-4"
                    style={{
                        left: `${LINE_LEFT}px`,
                        top: 0,
                        height: isLast ? '50%' : '100%',
                    }}
                />

                <div
                    className="absolute border-t border-depth-4"
                    style={{
                        left: `${LINE_LEFT}px`,
                        top: '50%',
                        width: `${LINE_WIDTH}px`,
                    }}
                />

                <div
                    className="flex items-center gap-1 relative"
                    style={{
                        paddingLeft: LINE_LEFT + LINE_WIDTH,
                    }}
                >
                    <div className="w-full px-3 h-9 rounded-md outline-none tabular-nums flex items-center text-nowrap relative z-10 border bg-depth-2 hover:bg-depth-3 border-depth-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <ScanBox size={16} className="shrink-0 text-foreground" />

                            <div className="border-l h-5 border-depth-4" />

                            <span className="text-sm truncate text-foreground">{parameter.name}</span>
                        </div>
                    </div>
                </div>
            </li>
        );
    }

    const canvasItem = item as CanvasItem;

    const isNode = canvasItem.kind === 'node';
    const isEdge = canvasItem.kind === 'edge';

    const node = isNode ? (canvasItem as Node) : null;

    const parameters = node?.parameters ?? [];

    const isNodeTabOpen = currentNodeId === canvasItem.id;

    const hasParameters = parameters.length > 0;

    const isPartOfSelectionGroup = isSelected && selectedItemIds.length > 1;

    const {
        listRef: parametersListRef,
        handleDragStart: handleParameterDragStart,
        handleDragOver: handleParameterDragOver,
        handleDrop: handleParameterDrop,
        handleDragEnd: handleParameterDragEnd,
    } = useDragAndDrop<Parameter>({
        filteredItems: parameters,
        items: parameters,
        selectedIds: [],
        onSelect: () => {},
        multiSelect: false,
        itemSelector: 'li[data-parameter-id]',
        onReorder: (newParameters) => {
            const { currentSceneId, scenes } = useItemsStore.getState();

            if (!currentSceneId) {
                return;
            }

            const scene = scenes[currentSceneId];

            if (!scene) {
                return;
            }

            const newItems = scene.items.map((sceneItem) => {
                if (sceneItem.id !== canvasItem.id) {
                    return sceneItem;
                }

                if (sceneItem.kind !== 'node') {
                    return sceneItem;
                }

                return {
                    ...sceneItem,
                    parameters: newParameters,
                };
            });

            useItemsStore.setState({
                scenes: {
                    ...scenes,
                    [currentSceneId]: {
                        ...scene,
                        items: newItems,
                        updatedAt: new Date(),
                    },
                },
            });
        },
    });

    const handleDoubleClick = (e: MouseEvent) => {
        e.stopPropagation();

        if (isNode) {
            openNodeTab(canvasItem.id, router);
        }
    };

    const toggleExpanded = (e: MouseEvent) => {
        e.stopPropagation();

        setIsExpanded((prev) => !prev);
    };

    const isLast = index === totalItems - 1;

    const LINE_LEFT = 18.8;
    const LINE_WIDTH = 16;

    const handleItemDragStart = (e: React.DragEvent) => {
        if (isNode && parameters.length > 0) {
            setIsExpanded(false);
        }

        handleDragStart?.(e, canvasItem.id);
    };

    return (
        <li
            data-id={canvasItem.id}
            className="relative select-none cursor-grab"
            onClick={(e) => selectItem?.(canvasItem.id, e.ctrlKey, e.shiftKey)}
            onDoubleClick={handleDoubleClick}
            onDragStart={handleItemDragStart}
            draggable
        >
            <div
                className="absolute border-l border-depth-4"
                style={{
                    left: `${LINE_LEFT}px`,
                    top: 0,
                    bottom: isLast && !isExpanded ? '50%' : 0,
                }}
            />

            {!(isNode && hasParameters && isExpanded) && (
                <div
                    className="absolute border-t border-depth-4"
                    style={{
                        left: `${LINE_LEFT}px`,
                        top: '50%',
                        width: `${LINE_WIDTH}px`,
                    }}
                />
            )}

            <div
                className="flex items-center gap-1 relative"
                style={{
                    paddingLeft: LINE_LEFT + LINE_WIDTH,
                }}
            >
                <div
                    className={`w-full px-3 h-9 rounded-md outline-none tabular-nums flex items-center text-nowrap relative z-10 border
                            ${
                                isSelected
                                    ? 'bg-bg-accent border-border-accent'
                                    : 'bg-depth-2 hover:bg-depth-3 border-depth-3'
                            }
                            ${isPartOfSelectionGroup ? 'border-border-accent' : ''}
                        `}
                >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        {isNode && hasParameters && (
                            <button
                                type="button"
                                onClick={toggleExpanded}
                                className={`flex items-center justify-center p-0.5 rounded shrink-0 cursor-pointer
                                    ${isSelected ? 'text-text-accent hover:bg-bg-accent' : 'hover:bg-depth-3'}
                                `}
                            >
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                        )}

                        {isNode &&
                            (isNodeTabOpen ? (
                                <PackageOpen size={16} className={isSelected ? 'text-text-accent' : 'text-foreground'} />
                            ) : (
                                <Package size={16} className={isSelected ? 'text-text-accent' : 'text-foreground'} />
                            ))}

                        {isEdge && (
                            <LineSquiggle size={16} className={isSelected ? 'text-text-accent' : 'text-foreground'} />
                        )}

                        <div
                            className={`
                                border-l h-5
                                ${isSelected ? 'border-border-accent' : 'border-depth-4'}
                            `}
                        />

                        <span
                            className={`
                                text-sm truncate
                                ${isSelected ? 'text-text-accent' : 'text-foreground'}
                            `}
                        >
                            {canvasItem.name}
                        </span>
                    </div>
                </div>
            </div>

            {isNode && isExpanded && parameters.length > 0 && (
                <ul
                    ref={parametersListRef}
                    className="flex flex-col gap-1 mt-1"
                    onDragOver={handleParameterDragOver}
                    onDrop={handleParameterDrop}
                    onDragEnd={handleParameterDragEnd}
                >
                    {parameters.map((parameter, parameterIndex) => (
                        <HierarchyItem
                            key={parameter.id ?? parameterIndex}
                            item={parameter}
                            index={parameterIndex}
                            totalItems={parameters.length}
                            isParameter
                            handleDragStart={handleParameterDragStart}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
});
