import { useItemsStore } from '@/store/useItemsStore';
import { getSelectedNode } from '@/utils/nodes/getSelectedNodes';

export const changeNodeName = (newName: string) => {
    const { currentSceneId, scenes } = useItemsStore.getState();

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];

    if (!scene) return;

    const selectedNode = getSelectedNode();

    if (!selectedNode) return;

    const newItems = scene.items.map((item) => (item.id === selectedNode.id ? { ...item, name: newName } : item));

    useItemsStore.setState((state) => ({
        scenes: {
            ...state.scenes,
            [currentSceneId]: {
                ...scene,
                items: newItems,
                updatedAt: new Date(),
            },
        },
    }));
};
