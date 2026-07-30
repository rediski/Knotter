'use client';

import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';

import type { CanvasItem } from '@/_core/_/canvas.types';
import { MAX_SCENE_ITEMS } from '@/_core/_/canvas.constants';

import { EmptyState } from '@/components/UI/EmptyState';
import { HierarchyItem } from '@/components/sidebar/HierarchyItem';

import { useItemsStore } from '@/store/useItemsStore';
import { useSidebarStore } from '@/store/useSidebarStore';

import { getRangeSelection } from '@/utils/canvas/getRangeSelection';
import { deleteSelectedItems } from '@/utils/items/deleteSelectedItems';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

import { LandPlot } from 'lucide-react';

export const Hierarchy = memo(function Hierarchy({ panelId }: { panelId?: string }) {
    const [mounted, setMounted] = useState(false);

    const { currentSceneId, scenes, selectedItemIds, setSelectedItemIds } = useItemsStore();

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const items: CanvasItem[] = scene?.items ?? [];

    const filterText = useSidebarStore((state) => (panelId ? state.filterText[panelId] : ''));

    const filteredItems = useMemo(() => {
        if (!currentSceneId) return [];

        const scene = scenes[currentSceneId];
        const items = scene?.items ?? [];

        const lowerText = filterText?.toLowerCase() || '';

        return items.filter((item) => item.name.toLowerCase().includes(lowerText));
    }, [currentSceneId, scenes, filterText]);

    const handleReorder = useCallback(
        (newItems: CanvasItem[]) => {
            if (currentSceneId && scene) {
                const { scenes } = useItemsStore.getState();
                const updatedScene = {
                    ...scene,
                    items: newItems,
                    updatedAt: new Date(),
                };
                useItemsStore.setState({ scenes: { ...scenes, [currentSceneId]: updatedScene } });
            }
        },
        [currentSceneId, scene],
    );

    const { draggingId, insertPosition, listRef, handleDragStart, handleDragOver, handleDrop, handleDragEnd } =
        useDragAndDrop<CanvasItem>({
            filteredItems,
            items,
            selectedIds: selectedItemIds,
            onSelect: setSelectedItemIds,
            onReorder: handleReorder,
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
    }, [selectedItemIds, deleteSelectedItems]);

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

                if (!wasDeleted) newSet.add(nodeId);

                setSelectedItemIds(Array.from(newSet));
                return;
            }

            if (shiftKey && selectedItemIds.length > 0) {
                const lastSelectedId = selectedItemIds[selectedItemIds.length - 1];
                const rangeSet = getRangeSelection(filteredItems, nodeId, lastSelectedId);

                if (rangeSet.size > 0) {
                    setSelectedItemIds(Array.from(rangeSet));
                }

                return;
            }

            setSelectedItemIds([nodeId]);
        },
        [selectedItemIds, setSelectedItemIds, filteredItems],
    );

    const selectScene = useCallback(() => {
        setSelectedItemIds([currentSceneId!]);
    }, [currentSceneId, setSelectedItemIds]);

    if (!mounted) {
        return <div className="flex flex-col h-full" />;
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            <ul
                ref={listRef}
                className="flex flex-col gap-1 m-1 pr-1 overflow-y-auto h-full relative"
                onClick={deselect}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {currentSceneId && scene && (
                    <>
                        <li className="relative select-none cursor-pointer" onClick={selectScene}>
                            <div className="flex items-center gap-1">
                                <div
                                    className={`
                                    w-full px-3 h-9 rounded-md outline-none tabular-nums flex items-center
                                    ${
                                        selectedItemIds.includes(currentSceneId)
                                            ? 'bg-bg-accent/10 border border-bg-accent/10'
                                            : 'bg-depth-2 hover:bg-depth-3 border border-depth-3'
                                    }
                                `}
                                >
                                    <div className="flex items-center gap-2 flex-1">
                                        <LandPlot
                                            size={16}
                                            className={`min-w-4 ${selectedItemIds.includes(currentSceneId) ? 'text-text-accent' : 'text-foreground'}`}
                                        />

                                        <div
                                            className={`border-l h-5 ${selectedItemIds.includes(currentSceneId) ? 'border-bg-accent/10' : 'border-depth-4'}`}
                                        />

                                        <span
                                            className={`text-sm ${selectedItemIds.includes(currentSceneId) ? 'text-text-accent' : 'text-foreground'}`}
                                        >
                                            {scene.name}
                                        </span>

                                        <span
                                            className={`ml-auto text-xs tabular-nums ${selectedItemIds.includes(currentSceneId) ? 'text-text-accent' : 'text-foreground'}`}
                                        >
                                            {items.length} / {MAX_SCENE_ITEMS}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <div className="relative my-1">
                            <hr className="border-depth-3" />
                        </div>
                    </>
                )}

                {filteredItems.length > 0 ? (
                    <>
                        {insertPosition !== null && draggingId && (
                            <div
                                className="absolute left-0 right-0 h-0.5 bg-bg-accent rounded-full z-20"
                                style={{
                                    top: `${(insertPosition + 1) * 39 + 20}px`,
                                    transition: 'top 0.05s ease-out',
                                }}
                            />
                        )}

                        {filteredItems.map((filteredItem, index) => (
                            <div key={filteredItem.id} className="relative">
                                <HierarchyItem
                                    filteredItem={filteredItem}
                                    index={index}
                                    selectItem={selectItem}
                                    isSelected={selectedItemIds.includes(filteredItem.id)}
                                    handleDragStart={handleDragStart}
                                    selectedItemIds={selectedItemIds}
                                />
                            </div>
                        ))}
                    </>
                ) : (
                    <EmptyState
                        message={
                            items.length === 0
                                ? 'Создайте элемент, нажав ПКМ по холсту.'
                                : `Не найдено элементов по запросу "${filterText}"`
                        }
                    />
                )}
            </ul>
        </div>
    );
});
