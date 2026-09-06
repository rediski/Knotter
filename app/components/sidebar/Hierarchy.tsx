'use client';

import React, { memo, useCallback, useState, useEffect } from 'react';

import type { CanvasItem } from '@/_core/_/canvas.types';
import { MAX_SCENE_ITEMS } from '@/_core/_/canvas.constants';

import { EmptyState } from '@/components/UI/EmptyState';
import { HierarchyItem } from '@/components/sidebar/HierarchyItem';

import { useItemsStore } from '@/store/useItemsStore';

import { getRangeSelection } from '@/utils/canvas/getRangeSelection';
import { deleteSelectedItems } from '@/utils/items/deleteSelectedItems';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

import { LandPlot, ChevronDown, ChevronRight } from 'lucide-react';

export const Hierarchy = memo(function Hierarchy() {
    const [mounted, setMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    const { currentSceneId, scenes, selectedItemIds, setSelectedItemIds } = useItemsStore();

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const items: CanvasItem[] = scene?.items ?? [];

    const handleReorder = useCallback(
        (newItems: CanvasItem[]) => {
            if (!currentSceneId || !scene) {
                return;
            }

            const { scenes } = useItemsStore.getState();

            const updatedScene = {
                ...scene,
                items: newItems,
                updatedAt: new Date(),
            };

            useItemsStore.setState({
                scenes: {
                    ...scenes,
                    [currentSceneId]: updatedScene,
                },
            });
        },
        [currentSceneId, scene],
    );

    const { listRef, handleDragStart, handleDragOver, handleDrop, handleDragEnd } = useDragAndDrop<CanvasItem>({
        items,
        selectedIds: selectedItemIds,
        onSelect: setSelectedItemIds,
        onReorder: handleReorder,
        itemSelector: 'li[data-id]',
        multiSelect: true,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;

            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return;
            }

            if (e.key === 'Delete' && selectedItemIds.length > 0) {
                e.preventDefault();
                deleteSelectedItems();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedItemIds]);

    const deselect = useCallback(
        (e: React.MouseEvent<HTMLUListElement>) => {
            if (e.target === e.currentTarget) {
                setSelectedItemIds([]);
            }
        },
        [setSelectedItemIds],
    );

    const selectItem = useCallback(
        (nodeId: string, ctrlKey: boolean, shiftKey: boolean) => {
            if (ctrlKey) {
                const newSet = new Set(selectedItemIds);
                const wasDeleted = newSet.delete(nodeId);

                if (!wasDeleted) {
                    newSet.add(nodeId);
                }

                setSelectedItemIds(Array.from(newSet));

                return;
            }

            if (shiftKey && selectedItemIds.length > 0) {
                const lastSelectedId = selectedItemIds[selectedItemIds.length - 1];
                const rangeSet = getRangeSelection(items, nodeId, lastSelectedId);

                if (rangeSet.size > 0) {
                    setSelectedItemIds(Array.from(rangeSet));
                }

                return;
            }

            setSelectedItemIds([nodeId]);
        },
        [selectedItemIds, setSelectedItemIds, items],
    );

    const selectScene = useCallback(() => {
        if (currentSceneId) {
            setSelectedItemIds([currentSceneId]);
        }
    }, [currentSceneId, setSelectedItemIds]);

    if (!mounted) {
        return <div className="flex flex-col h-full" />;
    }

    if (!currentSceneId || !scene) {
        return <div className="flex flex-col h-full" />;
    }

    const isSceneSelected = selectedItemIds.includes(currentSceneId);

    const visibleSelectedCount = items.filter((item) => selectedItemIds.includes(item.id)).length;

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            <ul
                ref={listRef}
                className="flex flex-col gap-1 m-1 mr-0 pr-1 overflow-y-auto h-full relative"
                onClick={deselect}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <li className="relative select-none cursor-pointer" onClick={selectScene}>
                    <div
                        className={`
                            w-full pr-3 pl-2 h-9 rounded-md outline-none tabular-nums flex items-center
                            ${
                                selectedItemIds.includes(currentSceneId)
                                    ? 'bg-bg-accent border border-border-accent'
                                    : 'bg-depth-2 hover:bg-depth-3 border border-depth-3'
                            }
                        `}
                    >
                        <div className="flex items-center gap-2 flex-1">
                            <button
                                type="button"
                                onClick={() => setIsExpanded((prev) => !prev)}
                                className={`
                                    flex items-center justify-center
                                    p-0.5 rounded cursor-pointer
                                    ${isSceneSelected ? 'text-text-accent hover:bg-bg-accent' : 'hover:bg-depth-3'}
                                `}
                            >
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>

                            <div
                                className={`
                                    border-l h-5
                                    ${isSceneSelected ? 'border-border-accent' : 'border-depth-4'}
                                `}
                            />

                            <LandPlot
                                size={16}
                                className={`
                                    min-w-4
                                    ${isSceneSelected ? 'text-text-accent' : 'text-foreground'}
                                `}
                            />

                            <div
                                className={`
                                    border-l h-5
                                    ${isSceneSelected ? 'border-border-accent' : 'border-depth-4'}
                                `}
                            />

                            <span
                                className={`
                                    text-sm truncate
                                    ${isSceneSelected ? 'text-text-accent' : 'text-foreground'}
                                `}
                            >
                                {scene.name}
                            </span>

                            <span
                                className={`
                                    ml-auto text-xs tabular-nums text-nowrap
                                    ${isSceneSelected ? 'text-text-accent' : 'text-foreground'}
                                `}
                            >
                                {items.length} / {MAX_SCENE_ITEMS}
                            </span>
                        </div>
                    </div>
                </li>

                {isExpanded && (
                    <>
                        {items.length > 0 ? (
                            <div className="flex flex-col gap-1 relative">
                                {visibleSelectedCount > 1 && (
                                    <div className="text-xs text-text-accent px-3 py-1 bg-bg-accent rounded-md truncate">
                                        Выбранных элементов: {visibleSelectedCount}
                                    </div>
                                )}

                                {items.map((item, index) => (
                                    <HierarchyItem
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        totalItems={items.length}
                                        selectItem={selectItem}
                                        isSelected={selectedItemIds.includes(item.id)}
                                        handleDragStart={handleDragStart}
                                        selectedItemIds={selectedItemIds}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState message={'Создайте элемент, нажав ПКМ по холсту.'} />
                        )}
                    </>
                )}
            </ul>
        </div>
    );
});
