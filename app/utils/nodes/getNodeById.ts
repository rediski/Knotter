import { useItemsStore } from '@/store/useItemsStore';
import type { Node } from '@/_core/_/canvas.types';

export const getNodeById = (nodeId: string): Node | undefined => {
    const { currentSceneId, scenes } = useItemsStore.getState();

    if (!currentSceneId) return undefined;

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    const node = items.find((item): item is Node => item.id === nodeId && item.kind === 'node');

    return node;
};
