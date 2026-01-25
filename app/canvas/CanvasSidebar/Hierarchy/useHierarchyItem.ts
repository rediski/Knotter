'use client';

import { useCallback, useRef, useState, useEffect } from 'react';

import type { CanvasItem } from '@/canvas/_core/_/canvas.types';

import { useCanvasStore } from '@/canvas/store/canvasStore';
import { selectCanvasItem } from '@/canvas/utils/items/selectItem';

type DragPosition = 'top' | 'bottom' | null;

export function useHierarchyItem(item: CanvasItem) {
    const selectedIds = useCanvasStore((state) => state.selectedItemIds);
    const setSelectedIds = useCanvasStore((state) => state.setSelectedItemIds);
    const setItems = useCanvasStore((state) => state.setItems);

    const dragRef = useRef<HTMLDivElement | null>(null);
    const dropRef = useRef<HTMLLIElement | null>(null);

    const [isDragOver, setIsDragOver] = useState(false);
    const [dragPosition, setDragPosition] = useState<DragPosition>(null);

    const isSelected = selectedIds.includes(item.id);

    const handleSelect = useCallback(
        (e: React.MouseEvent<HTMLLIElement>) => {
            e.stopPropagation();
            const items = useCanvasStore.getState().items;

            const newSelectedIds = selectCanvasItem({
                items,
                selectedIds,
                itemId: item.id,
                event: { ctrlKey: e.ctrlKey, metaKey: e.metaKey, shiftKey: e.shiftKey },
            });

            setSelectedIds(newSelectedIds);
        },
        [selectedIds, item.id, setSelectedIds],
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLLIElement>) => {
            if (e.key === 'Enter' && !isSelected) {
                setSelectedIds([...selectedIds, item.id]);
            }
        },
        [isSelected, selectedIds, item.id, setSelectedIds],
    );

    const handleNameChange = useCallback(
        (newName: string) => {
            const prev = useCanvasStore.getState().items;
            const next = prev.map((i) => (i.id === item.id ? { ...i, name: newName } : i));
            setItems(next);
        },
        [item.id, setItems],
    );

    useEffect(() => {
        const el = dragRef.current;
        if (!el) return;

        const handleDragStart = (e: DragEvent) => {
            e.dataTransfer?.setData('text/plain', item.id);
            e.dataTransfer!.effectAllowed = 'move';
        };

        el.addEventListener('dragstart', handleDragStart);
        return () => el.removeEventListener('dragstart', handleDragStart);
    }, [item.id]);

    useEffect(() => {
        const el = dropRef.current;
        if (!el) return;

        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            e.dataTransfer!.dropEffect = 'move';

            const rect = el.getBoundingClientRect();
            const offset = e.clientY - rect.top;
            const pos: DragPosition = offset < rect.height / 2 ? 'top' : 'bottom';

            setDragPosition(pos);
            setIsDragOver(true);
        };

        const handleDragLeave = () => {
            setIsDragOver(false);
            setDragPosition(null);
        };

        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);

            const draggedId = e.dataTransfer?.getData('text/plain');
            if (!draggedId || draggedId === item.id) return;

            const prev = useCanvasStore.getState().items;

            const fromIndex = prev.findIndex((i) => i.id === draggedId);
            const toIndex = prev.findIndex((i) => i.id === item.id);

            if (fromIndex === -1 || toIndex === -1) return;

            const next = [...prev];
            const [moved] = next.splice(fromIndex, 1);

            const insertIndex = dragPosition === 'top' ? toIndex : toIndex + 1;
            next.splice(insertIndex, 0, moved);

            setItems(next);
            setDragPosition(null);
        };

        el.addEventListener('dragover', handleDragOver);
        el.addEventListener('dragleave', handleDragLeave);
        el.addEventListener('drop', handleDrop);

        return () => {
            el.removeEventListener('dragover', handleDragOver);
            el.removeEventListener('dragleave', handleDragLeave);
            el.removeEventListener('drop', handleDrop);
        };
    }, [item.id, dragPosition, setItems]);

    return {
        isSelected,
        handleSelect,
        handleKeyDown,
        handleNameChange,
        dragRef,
        dropRef,
        isDragOver,
        dragPosition,
    };
}
