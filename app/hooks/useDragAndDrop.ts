'use client';

import { useRef, useState, useEffect } from 'react';
import { useItemsStore } from '@/canvas/store/useItemsStore';

type DragPosition = 'top' | 'bottom' | null;

interface useDragAndDropProps {
    itemId: string;
    onDrop?: (draggedId: string, targetId: string, position: DragPosition) => void;
}

export function useDragAndDrop({ itemId, onDrop }: useDragAndDropProps) {
    const dragRef = useRef<HTMLDivElement | null>(null);
    const dropRef = useRef<HTMLLIElement | null>(null);

    const [isDragOver, setIsDragOver] = useState(false);
    const [dragPosition, setDragPosition] = useState<DragPosition>(null);

    useEffect(() => {
        const el = dragRef.current;
        if (!el) return;

        const handleDragStart = (e: DragEvent) => {
            e.dataTransfer?.setData('text/plain', itemId);
            e.dataTransfer!.effectAllowed = 'move';
        };

        el.addEventListener('dragstart', handleDragStart);
        return () => el.removeEventListener('dragstart', handleDragStart);
    }, [itemId]);

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
            if (!draggedId || draggedId === itemId) return;

            const position = dragPosition;
            setDragPosition(null);

            if (onDrop) {
                onDrop(draggedId, itemId, position);
            } else {
                const prev = useItemsStore.getState().items;
                const fromIndex = prev.findIndex((i) => i.id === draggedId);
                const toIndex = prev.findIndex((i) => i.id === itemId);

                if (fromIndex === -1 || toIndex === -1) return;

                const next = [...prev];
                const [moved] = next.splice(fromIndex, 1);

                const insertIndex = position === 'top' ? toIndex : toIndex + 1;
                next.splice(insertIndex, 0, moved);

                useItemsStore.getState().setItems(next);
            }
        };

        el.addEventListener('dragover', handleDragOver);
        el.addEventListener('dragleave', handleDragLeave);
        el.addEventListener('drop', handleDrop);

        return () => {
            el.removeEventListener('dragover', handleDragOver);
            el.removeEventListener('dragleave', handleDragLeave);
            el.removeEventListener('drop', handleDrop);
        };
    }, [itemId, dragPosition, onDrop]);

    return {
        dragRef,
        dropRef,
        isDragOver,
        dragPosition,
    };
}
