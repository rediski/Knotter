'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import type { CanvasItem } from '@/canvas/_core/_/canvas.types';

import { selectItems } from '@/canvas/utils/items/selectItems';
import { deleteSelectedItems } from '@/canvas/utils/items/deleteSelectedItems';
import { useItemsStore } from '@/canvas/store/useItemsStore';
import { openNodeTab } from '@/canvas/utils/nodes/openNodeTab';

export function useHierarchyItem(canvasItem: CanvasItem) {
    const router = useRouter();

    const selectedItemIds = useItemsStore((state) => state.selectedItemIds);
    const setSelectedIds = useItemsStore((state) => state.setSelectedItemIds);
    const setItems = useItemsStore((state) => state.setItems);

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

        openNodeTab(canvasItem.id, router);
    }, [canvasItem.id, canvasItem.kind, router]);

    return {
        handleSelect,
        handleKeyDown,
        handleNameChange,
        handleNodeDoubleClick,
    };
}
