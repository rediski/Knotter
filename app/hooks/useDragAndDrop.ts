'use client';

import { useRef, useState, useEffect } from 'react';

type DragPosition = 'top' | 'bottom' | null;

interface useDragAndDropProps {
    itemId: string;
    onDrop?: (draggedId: string, targetId: string, position: DragPosition) => void;
}

export function useDragAndDrop({ itemId, onDrop }: useDragAndDropProps) {
    const dragRef = useRef<HTMLElement | null>(null);
    const dropRef = useRef<HTMLElement | null>(null);

    const [isDragOver, setIsDragOver] = useState(false);
    const [dragPosition, setDragPosition] = useState<DragPosition>(null);

    const dragPositionRef = useRef<DragPosition>(null);

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

            dragPositionRef.current = pos;
            setDragPosition(pos);
            setIsDragOver(true);
        };

        const handleDragLeave = (e: DragEvent) => {
            e.preventDefault();
            dragPositionRef.current = null;
            setIsDragOver(false);
            setDragPosition(null);
        };

        const handleDrop = (e: DragEvent) => {
            e.preventDefault();

            const draggedId = e.dataTransfer?.getData('text/plain');

            const currentPosition = dragPositionRef.current;

            setIsDragOver(false);
            setDragPosition(null);
            dragPositionRef.current = null;

            if (!draggedId || draggedId === itemId) return;

            if (onDrop) {
                onDrop(draggedId, itemId, currentPosition);
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
    }, [itemId, onDrop]);

    return {
        dragRef,
        dropRef,
        isDragOver,
        dragPosition,
    };
}
