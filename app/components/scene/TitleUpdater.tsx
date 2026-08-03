'use client';

import { useEffect } from 'react';

import { useItemsStore } from '@/store/useItemsStore';
import { getNodes } from '@/utils/nodes/getNodes';

export function TitleUpdater() {
    const currentSceneId = useItemsStore((state) => state.currentSceneId);
    const scenes = useItemsStore((state) => state.scenes);
    const currentNodeId = useItemsStore((state) => state.currentNodeId);

    useEffect(() => {
        const scene = currentSceneId ? scenes[currentSceneId] : null;

        if (currentNodeId && scene) {
            const items = scene.items ?? [];
            const nodes = getNodes(items);
            const openedNode = nodes.find((item) => item.id === currentNodeId && item.kind === 'node');

            if (openedNode?.name) {
                document.title = `${openedNode.name}`;
                return;
            }
        }

        if (scene?.name) document.title = `${scene.name}`;
    }, [currentSceneId, scenes, currentNodeId]);

    return null;
}
