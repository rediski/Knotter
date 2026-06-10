import type { Position } from '@/_core/_/canvas.types';
import { useItemsStore } from '@/store/useItemsStore';

export function changeNodePosition(nodeId: string, newPosition: Position) {
    const { currentSceneId, scenes } = useItemsStore.getState();

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    const updatedItems = items.map((item) => {
        if (item.kind === 'node' && item.id === nodeId) {
            return { ...item, position: newPosition };
        }

        return item;
    });

    if (scene) {
        const updatedScene = {
            ...scene,
            items: updatedItems,
            updatedAt: new Date(),
        };
        useItemsStore.setState({ scenes: { ...scenes, [currentSceneId]: updatedScene } });
    }
}
