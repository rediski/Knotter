import { useState, useRef, useCallback, type RefObject } from 'react';

interface Identifiable {
    id: string;
}

interface UseDragAndDropProps<Item extends Identifiable> {
    filteredItems: Item[];
    items: Item[];
    selectedIds: string[];
    onSelect: (ids: string[]) => void;
    onReorder: (newItems: Item[]) => void;
    onDragStart?: (e: React.DragEvent, ids: string[]) => void;
    itemSelector?: string;
    multiSelect?: boolean;
}

interface UseDragAndDropReturn {
    listRef: RefObject<HTMLUListElement | null>;
    handleDragStart: (e: React.DragEvent, id: string) => void;
    handleDragOver: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
    handleDragEnd: () => void;
}

export function useDragAndDrop<Item extends Identifiable>({
    items,
    selectedIds,
    onSelect,
    onReorder,
    onDragStart,
    itemSelector = 'li',
    multiSelect = true,
}: UseDragAndDropProps<Item>): UseDragAndDropReturn {
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);

    const handleDragStart = useCallback(
        (e: React.DragEvent, id: string): void => {
            e.stopPropagation();

            let idsToMove: string[];

            if (multiSelect) {
                if (!selectedIds.includes(id)) {
                    onSelect([id]);
                    idsToMove = [id];
                } else {
                    idsToMove = selectedIds;
                }
            } else {
                idsToMove = [id];
            }

            setDraggingId(id);

            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', JSON.stringify(idsToMove));

            onDragStart?.(e, idsToMove);
        },
        [multiSelect, selectedIds, onSelect, onDragStart],
    );

    const handleDragOver = useCallback(
        (e: React.DragEvent): void => {
            e.stopPropagation();
            e.preventDefault();

            if (!draggingId || !listRef.current) {
                return;
            }

            const target = (e.target as HTMLElement).closest(itemSelector);

            if (!target) {
                return;
            }

            const targetId = target.getAttribute(multiSelect ? 'data-id' : 'data-parameter-id');

            if (!targetId || targetId === draggingId) {
                return;
            }

            const targetIndex = items.findIndex((item) => item.id === targetId);
            const draggedIndex = items.findIndex((item) => item.id === draggingId);

            if (targetIndex === -1 || draggedIndex === -1) {
                return;
            }

            if (!multiSelect) {
                const rect = target.getBoundingClientRect();
                const relativeY = (e.clientY - rect.top) / rect.height;
                const isBefore = relativeY < 0.5;
                const newItems = [...items];
                const [draggedItem] = newItems.splice(draggedIndex, 1);

                let newIndex = targetIndex;

                if (draggedIndex < targetIndex) {
                    newIndex = isBefore ? targetIndex - 1 : targetIndex;
                } else {
                    newIndex = isBefore ? targetIndex : targetIndex + 1;
                }

                newIndex = Math.max(0, Math.min(newIndex, newItems.length));
                newItems.splice(newIndex, 0, draggedItem);

                const currentOrder = items.map((item) => item.id);
                const newOrder = newItems.map((item) => item.id);

                if (JSON.stringify(currentOrder) !== JSON.stringify(newOrder)) {
                    onReorder(newItems);
                }

                return;
            }

            if (selectedIds.includes(targetId)) {
                return;
            }

            const selectedItems = items.filter((item) => selectedIds.includes(item.id));

            const selectedIndices = selectedItems
                .map((item) => items.findIndex((i) => i.id === item.id))
                .sort((a, b) => a - b);

            if (selectedIndices.length === 0) {
                return;
            }

            const minSelectedIndex = Math.min(...selectedIndices);
            const maxSelectedIndex = Math.max(...selectedIndices);
            const selectedCount = selectedItems.length;

            const rect = target.getBoundingClientRect();
            const relativeY = (e.clientY - rect.top) / rect.height;

            const isBefore = relativeY < 0.5;

            const newItems = [...items];

            const itemsToMove = [...selectedIndices]
                .sort((a, b) => b - a)
                .map((index) => {
                    const [item] = newItems.splice(index, 1);
                    return item;
                })
                .reverse();

            let newIndex = targetIndex;

            if (maxSelectedIndex < targetIndex) {
                newIndex = isBefore ? targetIndex - selectedCount : targetIndex - selectedCount + 1;
            }

            if (minSelectedIndex > targetIndex) {
                newIndex = isBefore ? targetIndex : targetIndex + 1;
            }

            if (maxSelectedIndex >= targetIndex && minSelectedIndex <= targetIndex) {
                newIndex = isBefore ? targetIndex : targetIndex + 1;
            }

            newIndex = Math.max(0, Math.min(newIndex, newItems.length));

            newItems.splice(newIndex, 0, ...itemsToMove);

            const currentOrder = items.map((item) => item.id);
            const newOrder = newItems.map((item) => item.id);

            if (JSON.stringify(currentOrder) !== JSON.stringify(newOrder)) {
                onReorder(newItems);
            }
        },
        [draggingId, items, selectedIds, onReorder, itemSelector, multiSelect],
    );

    const handleDrop = useCallback((e: React.DragEvent): void => {
        e.stopPropagation();
        e.preventDefault();

        setDraggingId(null);
    }, []);

    const handleDragEnd = useCallback((): void => {
        setDraggingId(null);
    }, []);

    return {
        listRef,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
    };
}
