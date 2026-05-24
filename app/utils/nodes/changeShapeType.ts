import type { NodeShapeType } from '@/_core/_/nodeShapeType';
import { useItemsStore } from '@/store/useItemsStore';

export function changeShapeType(newShape: NodeShapeType) {
    const { currentSceneId, scenes, selectedItemIds } = useItemsStore.getState();

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    const updatedItems = items.map((item) => {
        if (item.kind === 'node' && selectedItemIds.includes(item.id)) {
            return { ...item, shapeType: newShape };
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
