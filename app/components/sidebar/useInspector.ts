'use client';

import { useItemsStore } from '@/store/useItemsStore';

import { getSelectedItem } from '@/utils/items/getSelectedItems';
import { getSelectedNode } from '@/utils/nodes/getSelectedNodes';

import { getNodes } from '@/utils/nodes/getNodes';
import { getEdges } from '@/utils/edges/getEdges';

export function useInspector() {
    const { currentSceneId, scenes } = useItemsStore();

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const items = scene?.items ?? [];

    const selectedItem = getSelectedItem();
    const selectedNode = getSelectedNode();

    const nodes = getNodes(items);
    const edges = getEdges(items);

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

        selectedItem,
        selectedNode,

        changeNodeName,
        changeNodeDescription,
    };
}
