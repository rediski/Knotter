import { useItemsStore } from '@/store/useItemsStore';
import { getSelectedNode } from '@/utils/nodes/getSelectedNodes';

export const unassignParameter = (parameterId: string) => {
    const itemsState = useItemsStore.getState();
    const { currentSceneId, scenes } = itemsState;

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];
    if (!scene) return;

    const node = getSelectedNode();
    if (!node) return;

    const updatedItems = scene.items.map((item) => {
        if (item.kind === 'node' && item.id === node.id) {
            return {
                ...item,
                parameters: item.parameters.filter((parameter) => parameter.id !== parameterId),
            };
        }

        return item;
    });

    useItemsStore.setState({
        scenes: {
            ...scenes,
            [currentSceneId]: {
                ...scene,
                items: updatedItems,
                updatedAt: new Date(),
            },
        },
    });
};
