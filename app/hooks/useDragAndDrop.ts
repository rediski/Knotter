import { useState, useRef, useCallback, type RefObject, useEffect } from 'react';

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

interface UseDragAndDropReturn<> {
    draggingId: string | null;
    insertPosition: number | null;
    listRef: RefObject<HTMLUListElement | null>;
    handleDragStart: (e: React.DragEvent, nodeId: string) => void;
    handleDragOver: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
    handleDragEnd: () => void;
    resetDragState: () => void;
}

export function useDragAndDrop<Item extends Identifiable>({
    filteredItems,
    items,
    selectedIds,
    onSelect,
    onReorder,
    itemSelector = 'li',
}: UseDragAndDropProps<Item>): UseDragAndDropReturn {
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [insertPosition, setInsertPosition] = useState<number | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);
  

    useEffect(() => {
        if (!listRef.current) return;

        const items = listRef.current.querySelectorAll(itemSelector);
        const heights: number[] = [];
        let totalHeight = 0;

        items.forEach((item) => {
            const rect = item.getBoundingClientRect();
            const height = rect.height;
            heights.push(totalHeight);
            totalHeight += height;
        });

     
    }, [filteredItems, itemSelector]);

    const handleDragStart = useCallback(
        (e: React.DragEvent, nodeId: string): void => {
            e.stopPropagation();

            if (!selectedIds.includes(nodeId)) {
                onSelect([nodeId]);
            }

            setDraggingId(nodeId);

            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData(
                'text/plain',
                JSON.stringify({
                    primaryId: nodeId,
                    selectedIds: selectedIds,
                }),
            );
        },
        [selectedIds, onSelect],
    );

    const handleDragOver = useCallback(
        (e: React.DragEvent): void => {
            e.stopPropagation();
            e.preventDefault();

            if (!draggingId || !listRef.current) return;

            const listRect = listRef.current.getBoundingClientRect();
            const mouseY = e.clientY - listRect.top;

            const items = listRef.current.querySelectorAll(itemSelector);
            let insertPos = items.length;

            for (let i = 0; i < items.length; i++) {
                const rect = items[i].getBoundingClientRect();
                const itemMiddle = rect.top + rect.height / 2 - listRect.top;

                if (mouseY < itemMiddle) {
                    insertPos = i;
                    break;
                }
            }

            const currentIndexes = selectedIds.map((id) => filteredItems.findIndex((item) => item.id === id));
            const minIndex = Math.min(...currentIndexes);
            const maxIndex = Math.max(...currentIndexes);

            let insertPosFinal: number | null = insertPos;

            if (insertPos >= minIndex && insertPos <= maxIndex + 1) {
                insertPosFinal = null;
            }

            setInsertPosition(insertPosFinal);
        },
        [draggingId, filteredItems, selectedIds, itemSelector],
    );

    const handleDrop = useCallback(
        (e: React.DragEvent): void => {
            e.stopPropagation();
            e.preventDefault();

            if (!draggingId || insertPosition === null) {
                setDraggingId(null);
                setInsertPosition(null);
                return;
            }

            let selectedIdsToMove: string[] = [draggingId];

            try {
                const rawData = e.dataTransfer.getData('text/plain');
                const data = JSON.parse(rawData) as { primaryId: string; selectedIds: string[] };

                if (data.selectedIds && Array.isArray(data.selectedIds)) {
                    selectedIdsToMove = data.selectedIds;
                }
            } catch (error) {
                console.warn('Failed to parse drag data:', error);
            }

            const currentIndexes = selectedIdsToMove.map((id) => filteredItems.findIndex((item) => item.id === id));
            const minIndex = Math.min(...currentIndexes);
            const selectedCount = selectedIdsToMove.length;

            if (currentIndexes.includes(-1) || minIndex === insertPosition) {
                setDraggingId(null);
                setInsertPosition(null);
                return;
            }

            const newItems = [...items];

            const itemsToMove = selectedIdsToMove
                .map((id) => {
                    const index = newItems.findIndex((item) => item.id === id);
                    if (index === -1) return null;
                    const [item] = newItems.splice(index, 1);
                    return item;
                })
                .filter((item): item is Item => item !== null);

            if (itemsToMove.length === 0) {
                setDraggingId(null);
                setInsertPosition(null);
                return;
            }

            let targetIndex = insertPosition;
            if (minIndex < insertPosition) {
                targetIndex = insertPosition - selectedCount;
            }

            const clampedTargetIndex = Math.max(0, Math.min(targetIndex, newItems.length));
            newItems.splice(clampedTargetIndex, 0, ...itemsToMove);

            onReorder(newItems);

            setDraggingId(null);
            setInsertPosition(null);
        },
        [draggingId, insertPosition, filteredItems, items, onReorder],
    );

    const handleDragEnd = useCallback((): void => {
        setDraggingId(null);
        setInsertPosition(null);
    }, []);

    const resetDragState = useCallback((): void => {
        setDraggingId(null);
        setInsertPosition(null);
    }, []);

    return {
        draggingId,
        insertPosition,
        listRef,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
        resetDragState,
    };
}
