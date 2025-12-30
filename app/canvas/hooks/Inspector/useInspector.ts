'use client';

import { useCallback } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';

import { useCanvasHandlers } from '@/canvas/hooks/useCanvasHandlers';

import { moveNodes } from '@/canvas/utils/nodes/moveNodes';

import { Position, Node } from '@/canvas/canvas.types';

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

    const changeNodePosition = useCallback(
        (axis: 'x' | 'y', value: number) => {
            if (!selectedNode) return;

            const initialPositions = new Map<string, Position>();

            selectedItemIds.forEach((id) => {
                const nodes = items.find((item) => item.id === id && item.kind === 'node');
                if (nodes) initialPositions.set(id, nodes.position);
            });

            const delta: Position = {
                x: axis === 'x' ? value - selectedNode.position.x : 0,
                y: axis === 'y' ? value - selectedNode.position.y : 0,
            };

            const updatedNodes = moveNodes(delta, initialPositions);
            const updatedItems = items.map((item) => updatedNodes.find((node) => node.id === item.id) ?? item);

            setItems(updatedItems);
        },
        [selectedNode, selectedItemIds, items, setItems],
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

        сhangeItemName,
        changeItemDescription,
        changeNodeShapeType,
        changeNodePosition,
    };
}
