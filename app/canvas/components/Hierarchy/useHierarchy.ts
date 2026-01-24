'use client';

import { useMemo, useCallback } from 'react';

import { CanvasItem } from '@/canvas/canvas.types';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { selectCanvasItem } from '@/canvas/utils/items/selectItem';

import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export function useHierarchy(filterText: string) {
    const items = useCanvasStore((state) => state.items);
    const selectedIds = useCanvasStore((state) => state.selectedItemIds);
    const setSelectedIds = useCanvasStore((state) => state.setSelectedItemIds);
    const setItems = useCanvasStore((state) => state.setItems);

    const filteredItems = useMemo(() => {
        const lower = filterText.toLowerCase();

        return items.filter((item) => item.name.toLowerCase().includes(lower));
    }, [items, filterText]);

    const handleItemChange = useCallback(
        (updated: CanvasItem) => {
            const updatedItems = items.map((i) => (i.id === updated.id ? updated : i));
            setItems(updatedItems);
        },
        [items, setItems],
    );

    const handleItemSelect = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>, itemId: string) => {
            const newSelectedIds = selectCanvasItem({
                items,
                selectedIds,
                itemId,
                event: {
                    ctrlKey: e.ctrlKey,
                    metaKey: e.metaKey,
                    shiftKey: e.shiftKey,
                },
            });

            setSelectedIds(newSelectedIds);
        },
        [items, selectedIds, setSelectedIds],
    );

    const handleDeselectOnEmptyClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) {
                setSelectedIds([]);
            }
        },
        [setSelectedIds],
    );

    const handleItemKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLButtonElement>, item: CanvasItem) => {
            if (e.key !== 'Enter') return;

            if (!selectedIds.includes(item.id)) {
                setSelectedIds([...selectedIds, item.id]);
            }
        },
        [selectedIds, setSelectedIds],
    );

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;

            if (!over || active.id === over.id) return;

            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);

            if (oldIndex === -1 || newIndex === -1) return;

            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);
        },
        [items, setItems],
    );

    return {
        filteredItems,
        selectedIds,
        handleItemChange,
        handleItemSelect,
        handleItemKeyDown,
        handleDeselectOnEmptyClick,
        handleDragEnd,
    };
}
