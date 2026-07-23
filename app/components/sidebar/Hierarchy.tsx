'use client';

import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';

import { EmptyState } from '@/components/UI/EmptyState';
import { HierarchyItem } from '@/components/sidebar/HierarchyItem';

import { useItemsStore } from '@/store/useItemsStore';
import { useSidebarStore } from '@/store/useSidebarStore';

import { getRangeSelection } from '@/utils/canvas/getRangeSelection';
import { deleteSelectedItems } from '@/utils/items/deleteSelectedItems';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';

import type { CanvasItem } from '@/_core/_/canvas.types';

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

    if (!mounted) {
        return <div className="flex flex-col h-full" />;
    }

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            <ul
                ref={listRef}
                className="flex flex-col gap-1 m-1 overflow-y-auto h-full relative"
                onClick={deselect}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {filteredItems.length > 0 ? (
                    <>
                        {insertPosition !== null && draggingId && (
                            <div
                                className="absolute left-0 right-0 h-0.5 bg-bg-accent rounded-full z-20"
                                style={{
                                    top: `${insertPosition * 39}px`,
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
