import { useItemsStore } from '@/store/useItemsStore';
import { getSelectedNode } from '@/utils/nodes/getSelectedNodes';

export const changeNodeDescription = (newDesc: string) => {
    const { currentSceneId, scenes } = useItemsStore.getState();

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];

    if (!scene) return;

    const selectedNode = getSelectedNode();

    if (!selectedNode) return;

    const newItems = scene.items.map((item) => (item.id === selectedNode.id ? { ...item, description: newDesc } : item));

    if (currentSceneId && scene) {
        useItemsStore.setState({
            scenes: {
                ...scenes,
                [currentSceneId]: {
                    ...scene,
                    items: newItems,
                    updatedAt: new Date(),
                },
            },
        });
    }
};
