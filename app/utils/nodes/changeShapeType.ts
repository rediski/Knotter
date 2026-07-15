import type { NodeShapeType } from '@/_core/_/nodeShapeType';
import { useItemsStore } from '@/store/useItemsStore';

import { addToHistory } from '@/utils/history/historyManager';
import { getSelectedNodes } from '@/utils/nodes/getSelectedNodes';

export function changeShapeType(newShape: NodeShapeType) {
    const { currentSceneId, scenes } = useItemsStore.getState();

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    const selectedNodes = getSelectedNodes();

    const updatedItems = items.map((item) => {
        if (item.kind === 'node' && selectedNodes.some((node) => node.id === item.id)) {
            return { ...item, shapeType: newShape };
        }

        return item;
    });

    const changedItems = updatedItems.filter(
        (item) => item.kind === 'node' && selectedNodes.some((node) => node.id === item.id),
    );

    if (scene && changedItems.length > 0) {
        const updatedScene = {
            ...scene,
            items: updatedItems,
            updatedAt: new Date(),
        };

        useItemsStore.setState({ scenes: { ...scenes, [currentSceneId]: updatedScene } });

        addToHistory({
            type: 'CHANGE_ITEMS',
            items: structuredClone(changedItems),
        });
    }
}
