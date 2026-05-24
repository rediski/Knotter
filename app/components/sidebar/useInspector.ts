'use client';

import { useMemo } from 'react';

import type { Node, Position } from '@/_core/_/canvas.types';

import { useItemsStore } from '@/store/useItemsStore';

import { moveNodes } from '@/utils/nodes/moveNodes';
import { getSelectedItem } from '@/utils/items/getSelectedItems';
import { getSelectedNode } from '@/utils/nodes/getSelectedNodes';
import { getNodes } from '@/utils/nodes/getNodes';
import { getEdges } from '@/utils/edges/getEdges';

export function useInspector() {
    const { currentSceneId, scenes, selectedItemIds } = useItemsStore();

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const items = scene?.items ?? [];

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

        const newItems = [...updatedNodes, ...edges];

        if (currentSceneId && scene) {
            const updatedScene = {
                ...scene,
                items: newItems,
                updatedAt: new Date(),
            };
            useItemsStore.setState({ scenes: { ...scenes, [currentSceneId]: updatedScene } });
        }
    };

    const changeNodeName = (newName: string) => {
        if (!selectedNode) return;
        const updatedNodes = nodes.map((node) => (node.id === selectedNode?.id ? { ...node, name: newName } : node));

        const updatedItems = [...updatedNodes, ...edges];

        if (currentSceneId && scene) {
            const updatedScene = {
                ...scene,
                items: updatedItems,
                updatedAt: new Date(),
            };
            useItemsStore.setState({ scenes: { ...scenes, [currentSceneId]: updatedScene } });
        }
    };

    const changeNodeDescription = (newDesc: string) => {
        if (!selectedNode) return;
        const updatedNodes = nodes.map((node) => (node.id === selectedNode?.id ? { ...node, description: newDesc } : node));

        const updatedItems = [...updatedNodes, ...edges];

        if (currentSceneId && scene) {
            const updatedScene = {
                ...scene,
                items: updatedItems,
                updatedAt: new Date(),
            };
            useItemsStore.setState({ scenes: { ...scenes, [currentSceneId]: updatedScene } });
        }
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
