'use client';

import { useCallback, useMemo } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';

import { useCanvasHandlers } from '@/canvas/hooks/useCanvasHandlers';
import { moveItems } from '@/canvas/utils/items/moveItems';
import type { Node, Position } from '@/canvas/canvas.types';

export function useInspector() {
    const items = useCanvasStore((state) => state.items);
    const setItems = useCanvasStore((state) => state.setItems);
    const selectedItem = useCanvasStore((state) => state.selectedItem);
    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);

    const { changeNodeShapeType } = useCanvasHandlers();

    const selectedNode: Node | null = selectedItem?.kind === 'node' ? selectedItem : null;

    const shapeType = selectedNode?.shapeType ?? null;
    const positionX = selectedNode?.position?.x ?? 0;
    const positionY = selectedNode?.position?.y ?? 0;

    const initialPositions = useMemo(() => {
        const map = new Map<string, Position>();

        if (!selectedItem) return map;

        if (selectedItemIds.length > 0) {
            items.forEach((item) => {
                if (selectedItemIds.includes(item.id)) {
                    map.set(item.id, { x: item.position.x, y: item.position.y });
                }
            });

            return map;
        }

        map.set(selectedItem.id, { x: selectedItem.position.x, y: selectedItem.position.y });

        return map;
    }, [selectedItem, selectedItemIds, items]);

    const changeItemsPosition = useCallback(
        (axis: 'x' | 'y', value: number) => {
            const updatedInitialPositions = new Map(initialPositions);

            if (updatedInitialPositions.size === 0 && selectedItem) {
                items.forEach((item) => {
                    if (selectedItemIds.includes(item.id) || item.id === selectedItem.id) {
                        updatedInitialPositions.set(item.id, {
                            x: item.position.x,
                            y: item.position.y,
                        });
                    }
                });
            }

            const dragDelta = {
                x: axis === 'x' ? value - positionX : 0,
                y: axis === 'y' ? value - positionY : 0,
            };

            const updatedItems = moveItems(dragDelta, updatedInitialPositions);
            setItems(updatedItems);
        },
        [selectedItem, positionX, positionY, initialPositions, items, selectedItemIds, setItems],
    );

    const сhangeItemName = useCallback(
        (newName: string) => {
            if (!selectedItem) return;

            const updatedItems = items.map((item) => (item.id === selectedItem.id ? { ...item, name: newName } : item));

            setItems(updatedItems);
        },
        [selectedItem, items, setItems],
    );

    const changeItemDescription = useCallback(
        (newDesc: string) => {
            if (!selectedItem) return;

            const updatedItems = items.map((item) =>
                item.id === selectedItem.id ? { ...item, description: newDesc } : item,
            );

            setItems(updatedItems);
        },
        [selectedItem, items, setItems],
    );

    return {
        selectedNode,
        shapeType,
        positionX,
        positionY,
        initialPositions,

        сhangeItemName,
        changeItemDescription,
        changeItemsPosition,
        changeNodeShapeType,
    };
}
