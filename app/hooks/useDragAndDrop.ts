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
    itemSelector?: string;
}

interface UseDragAndDropReturn {
    listRef: RefObject<HTMLUListElement | null>;
    handleDragStart: (e: React.DragEvent, nodeId: string) => void;
    handleDragOver: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
    handleDragEnd: () => void;
}

export function useDragAndDrop<Item extends Identifiable>({
    items,
    selectedIds,
    onSelect,
    onReorder,
    itemSelector = 'li',
}: UseDragAndDropProps<Item>): UseDragAndDropReturn {
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragOverId, setDragOverId] = useState<string | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);

    const handleDragStart = useCallback(
        (e: React.DragEvent, nodeId: string): void => {
            e.stopPropagation();

            if (!selectedIds.includes(nodeId)) {
                onSelect([nodeId]);
            }

            setDraggingId(nodeId);

            const idsToMove = selectedIds.includes(nodeId) ? selectedIds : [nodeId];

            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData(
                'text/plain',
                JSON.stringify({
                    primaryId: nodeId,
                    selectedIds: idsToMove,
                }),
            );
        },
        [selectedIds, onSelect],
    );

    const handleDragOver = useCallback(
        (e: React.DragEvent): void => {
            e.stopPropagation();
            e.preventDefault();

            if (!draggingId || !listRef.current) {
                setDragOverId(null);
                return;
            }

            const target = (e.target as HTMLElement).closest(itemSelector);

            if (!target) {
                setDragOverId(null);
                return;
            }

            const targetId = target.getAttribute('data-id');

            if (!targetId || targetId === draggingId) {
                setDragOverId(null);
                return;
            }

            if (selectedIds.includes(targetId)) {
                setDragOverId(null);
                return;
            }

            const targetIndex = items.findIndex((item) => item.id === targetId);
            const draggedIndex = items.findIndex((item) => item.id === draggingId);

            if (targetIndex === -1 || draggedIndex === -1) {
                setDragOverId(null);
                return;
            }

            const selectedItems = items.filter((item) => selectedIds.includes(item.id));
            const selectedIndices = selectedItems
                .map((item) => items.findIndex((i) => i.id === item.id))
                .sort((a, b) => a - b);

            const minSelectedIndex = Math.min(...selectedIndices);
            const maxSelectedIndex = Math.max(...selectedIndices);
            const selectedCount = selectedItems.length;

            const rect = target.getBoundingClientRect();
            const mouseY = e.clientY;
            const relativeY = (mouseY - rect.top) / rect.height;

            const isBefore = relativeY < 0.5;

            const newItems = [...items];

            const itemsToMove = selectedIndices
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
                setDragOverId(targetId);
                return;
            }

            setDragOverId(null);
        },
        [draggingId, items, selectedIds, onReorder, itemSelector],
    );

    const handleDrop = useCallback((e: React.DragEvent): void => {
        e.stopPropagation();
        e.preventDefault();

        setDraggingId(null);
        setDragOverId(null);
    }, []);

    const handleDragEnd = useCallback((): void => {
        setDraggingId(null);
        setDragOverId(null);
    }, []);

    return {
        listRef,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
    };
}
