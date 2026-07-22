'use client';

import React, { memo, useCallback, useMemo, useState, useEffect, useRef } from 'react';

import { EmptyState } from '@/components/UI/EmptyState';
import { HierarchyItem } from '@/components/sidebar/HierarchyItem';

import { useItemsStore } from '@/store/useItemsStore';
import { useSidebarStore } from '@/store/useSidebarStore';

import { getNodes } from '@/utils/nodes/getNodes';
import { getRangeSelection } from '@/utils/canvas/getRangeSelection';
import { moveNodeUp, moveNodeDown } from '@/utils/nodes/moveNode';
import { deleteSelectedItems } from '@/utils/items/deleteSelectedItems';

export const Hierarchy = memo(function Hierarchy({ panelId }: { panelId?: string }) {
    const [mounted, setMounted] = useState(false);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [insertPosition, setInsertPosition] = useState<number | null>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const { currentSceneId, scenes, selectedItemIds, setSelectedItemIds } = useItemsStore();

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const items = scene?.items ?? [];

    const filterText = useSidebarStore((state) => (panelId ? state.filterText[panelId] : ''));

    const filteredItems = useMemo(() => {
        if (!currentSceneId) return [];

        const scene = scenes[currentSceneId];
        const items = scene?.items ?? [];

        const lowerText = filterText?.toLowerCase() || '';

        return items.filter((item) => item.name.toLowerCase().includes(lowerText));
    }, [currentSceneId, scenes, filterText]);

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

    const selectItem = (nodeId: string, ctrlKey: boolean, shiftKey: boolean) => {
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
    };

    const handleDragStart = (e: React.DragEvent, nodeId: string) => {
        e.stopPropagation();

        if (!selectedItemIds.includes(nodeId)) {
            setSelectedItemIds([nodeId]);
        }

        setDraggingId(nodeId);

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData(
            'text/plain',
            JSON.stringify({
                primaryId: nodeId,
                selectedIds: selectedItemIds,
            }),
        );
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!draggingId || !listRef.current) return;

        const listRect = listRef.current.getBoundingClientRect();
        const mouseY = e.clientY - listRect.top;
        const itemHeight = 38;

        const position = Math.floor(mouseY / itemHeight);
        const clampedPosition = Math.max(0, Math.min(position, filteredItems.length));

        const currentIndexes = selectedItemIds.map((id) => filteredItems.findIndex((item) => item.id === id));
        const minIndex = Math.min(...currentIndexes);
        const maxIndex = Math.max(...currentIndexes);

        let insertPos: number | null = clampedPosition;

        if (clampedPosition >= minIndex && clampedPosition <= maxIndex + 1) {
            insertPos = null;
        }

        setInsertPosition(insertPos);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!draggingId || insertPosition === null) {
            setDraggingId(null);
            setInsertPosition(null);
            return;
        }

        let selectedIds = [draggingId];

        try {
            const rawData = e.dataTransfer.getData('text/plain');
            const data = JSON.parse(rawData);

            if (data.selectedIds && Array.isArray(data.selectedIds)) {
                selectedIds = data.selectedIds;
            }
        } catch (error) {
            console.warn('Failed to parse drag data:', error);
        }

        const currentIndexes = selectedIds.map((id) => filteredItems.findIndex((item) => item.id === id));
        const minIndex = Math.min(...currentIndexes);
        const selectedCount = selectedIds.length;

        if (currentIndexes.includes(-1) || minIndex === insertPosition) {
            setDraggingId(null);
            setInsertPosition(null);
            return;
        }

        let newItems = items;

        if (minIndex < insertPosition) {
            for (let i = selectedCount - 1; i >= 0; i--) {
                const nodeId = selectedIds[i];
                const currentIndex = currentIndexes[i];

                for (let j = currentIndex; j < insertPosition; j++) {
                    newItems = moveNodeDown(newItems, nodeId);
                }
            }
        }

        if (minIndex > insertPosition) {
            for (let i = 0; i < selectedCount; i++) {
                const nodeId = selectedIds[i];
                const currentIndex = currentIndexes[i];

                for (let j = currentIndex; j > insertPosition; j--) {
                    newItems = moveNodeUp(newItems, nodeId);
                }
            }
        }

        if (currentSceneId) {
            const updatedScene = {
                ...scene!,
                items: newItems,
                updatedAt: new Date(),
            };
            useItemsStore.setState({ scenes: { ...scenes, [currentSceneId]: updatedScene } });
        }

        setDraggingId(null);
        setInsertPosition(null);
    };

    const handleDragEnd = () => {
        setDraggingId(null);
        setInsertPosition(null);
    };

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
