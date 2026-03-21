'use client';

import { useCallback } from 'react';

import type { CanvasItem } from '@/canvas/_core/_/canvas.types';

import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { selectItems } from '@/canvas/utils/items/selectItems';
import { deleteSelectedItems } from '@/canvas/utils/items/deleteSelectedItems';
import { useItemsStore } from '@/canvas/store/useItemsStore';

export function useHierarchyItem(canvasItem: CanvasItem) {
    const selectedItemIds = useItemsStore((state) => state.selectedItemIds);
    const setSelectedIds = useItemsStore((state) => state.setSelectedItemIds);
    const setItems = useItemsStore((state) => state.setItems);

    const openedTabIds = useCanvasStore((state) => state.openedTabIds);
    const setOpenedTabIds = useCanvasStore((state) => state.setOpenedTabIds);
    const setSelectedTabId = useCanvasStore((state) => state.setSelectedTabId);

    const handleSelect = useCallback(
        (e: React.MouseEvent<HTMLLIElement>) => {
            e.stopPropagation();

            const newSelectedIds = selectItems({
                itemId: canvasItem.id,
                event: e,
            });

            setSelectedIds(newSelectedIds);
        },
        [canvasItem.id, setSelectedIds],
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLLIElement>) => {
            if (e.key === 'Delete' && selectedItemIds.includes(canvasItem.id)) {
                deleteSelectedItems();
            }
        },
        [selectedItemIds, canvasItem.id],
    );

    const handleNameChange = useCallback(
        (newName: string) => {
            const prev = useItemsStore.getState().items;
            const next = prev.map((item) => (item.id === canvasItem.id ? { ...item, name: newName } : item));
            setItems(next);
        },
        [canvasItem.id, setItems],
    );

    const handleNodeDoubleClick = useCallback(() => {
        if (canvasItem.kind !== 'node') return;

        if (!openedTabIds.includes(canvasItem.id)) {
            setOpenedTabIds([...openedTabIds, canvasItem.id]);
        }

        setSelectedTabId(canvasItem.id);
        setSelectedIds([canvasItem.id]);
    }, [canvasItem.id, canvasItem.kind, openedTabIds, setOpenedTabIds, setSelectedTabId, setSelectedIds]);

    return {
        handleSelect,
        handleKeyDown,
        handleNameChange,
        handleNodeDoubleClick,
    };
}
