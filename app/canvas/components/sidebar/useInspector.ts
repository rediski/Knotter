'use client';

import { useMemo } from 'react';

import type { Node, Position } from '@/canvas/_core/_/canvas.types';

import { useItemsStore } from '@/canvas/store/useItemsStore';

import { moveNodes } from '@/canvas/utils/nodes/moveNodes';
import { getSelectedItem } from '@/canvas/utils/items/getSelectedItems';
import { getSelectedNode } from '@/canvas/utils/nodes/getSelectedNodes';
import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { getEdges } from '@/canvas/utils/edges/getEdges';

export function useInspector() {
    const items = useItemsStore((state) => state.items);
    const setItems = useItemsStore((state) => state.setItems);
    const selectedItemIds = useItemsStore((state) => state.selectedItemIds);

    const selectedItem = getSelectedItem({ items, selectedItemIds });
    const selectedNode = getSelectedNode({ items, selectedItemIds }) as Node | null;

    const nodes = getNodes(items);
    const edges = getEdges(items);

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
            x: axis === 'x' ? value - selectedNode.position.x : 0,
            y: axis === 'y' ? value - selectedNode.position.y : 0,
        };

        const updatedNodes = moveNodes(dragDelta, updatedInitialPositions);

        const updatedItems = [...updatedNodes, ...edges];
        setItems(updatedItems);
    };

    const changeNodeName = (newName: string) => {
        if (!selectedNode) return;
        const updatedNodes = nodes.map((node) => (node.id === selectedNode?.id ? { ...node, name: newName } : node));

        const updatedItems = [...updatedNodes, ...edges];
        setItems(updatedItems);
    };

    const changeNodeDescription = (newDesc: string) => {
        if (!selectedNode) return;
        const updatedNodes = nodes.map((node) => (node.id === selectedNode?.id ? { ...node, description: newDesc } : node));

        const updatedItems = [...updatedNodes, ...edges];
        setItems(updatedItems);
    };

    return {
        shapeType: selectedNode?.shapeType ?? null,
        positionX: selectedNode?.position.x ?? 0,
        positionY: selectedNode?.position.y ?? 0,

        selectedItem,
        selectedNode,

        changeNodeName,
        changeNodeDescription,
        changeNodesPosition,
    };
}
