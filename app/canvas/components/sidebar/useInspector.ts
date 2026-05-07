'use client';

import { useMemo } from 'react';

import type { Node, Position } from '@/canvas/_core/_/canvas.types';

import { useItemsStore } from '@/canvas/store/useItemsStore';

import { moveNodes } from '@/canvas/utils/nodes/moveNodes';
import { getSelectedItem } from '@/canvas/utils/items/getSelectedItems';
import { getSelectedNode } from '@/canvas/utils/nodes/getSelectedNodes';
import { getNodes } from '@/canvas/utils/nodes/getNodes';

export function useInspector() {
    const items = useItemsStore((state) => state.items);
    const setItems = useItemsStore((state) => state.setItems);
    const selectedItemIds = useItemsStore((state) => state.selectedItemIds);

    const selectedItem = getSelectedItem({ items, selectedItemIds });
    const selectedNode = getSelectedNode({ items, selectedItemIds }) as Node | null;

    const shapeType = selectedNode?.shapeType ?? null;
    const positionX = selectedNode?.position.x ?? 0;
    const positionY = selectedNode?.position.y ?? 0;

    const nodes = getNodes(items);

    const initialPositions = useMemo(() => {
        const map = new Map<string, Position>();

        if (!selectedNode) return map;

        if (selectedItemIds.length > 0) {
            nodes.forEach((node) => {
                if (selectedItemIds.includes(node.id)) {
                    map.set(node.id, {
                        x: node.position.x,
                        y: node.position.y,
                    });
                }
            });

            return map;
        }

        map.set(selectedNode.id, {
            x: selectedNode.position.x,
            y: selectedNode.position.y,
        });

        return map;
    }, [selectedNode, selectedItemIds, nodes]);

    const getUpdatedPositions = () => {
        const updated = new Map(initialPositions);

        if (updated.size === 0 && selectedNode) {
            nodes.forEach((node) => {
                if (selectedItemIds.includes(node.id) || node.id === selectedNode.id) {
                    updated.set(node.id, {
                        x: node.position.x,
                        y: node.position.y,
                    });
                }
            });
        }

        return updated;
    };

    const changeNodesPosition = (axis: 'x' | 'y', value: number) => {
        if (!selectedNode) return;

        const updatedInitialPositions = getUpdatedPositions();

        const dragDelta = {
            x: axis === 'x' ? value - positionX : 0,
            y: axis === 'y' ? value - positionY : 0,
        };

        const updatedNodes = moveNodes(dragDelta, updatedInitialPositions);
        setItems(updatedNodes);
    };

    const changeNodeName = (newName: string) => {
        if (!selectedNode) return;
        const updatedNodes = nodes.map((node) => (node.id === selectedNode?.id ? { ...node, name: newName } : node));

        setItems(updatedNodes);
    };

    const changeNodeDescription = (newDesc: string) => {
        if (!selectedNode) return;
        const updatedNodes = nodes.map((node) => (node.id === selectedNode?.id ? { ...node, description: newDesc } : node));

        setItems(updatedNodes);
    };

    return {
        shapeType,
        positionX,
        positionY,
        initialPositions,
        selectedItem,
        selectedNode,

        changeNodeName,
        changeNodeDescription,
        changeNodesPosition,
    };
}
