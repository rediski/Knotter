import { useItemsStore } from '@/store/useItemsStore';

export const unassignParameter = (parameterId: string, nodeId: string) => {
    const state = useItemsStore.getState();
    const { currentSceneId, scenes } = state;

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];
    if (!scene) return;

    const updatedItems = scene.items.map((item) => {
        if (item.kind === 'node' && item.id === nodeId) {
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
