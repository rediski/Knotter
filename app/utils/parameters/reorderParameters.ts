import { useItemsStore } from '@/store/useItemsStore';
import type { Parameter } from '@/_core/_/parameter';

interface ReorderParametersParams {
    canvasItemId: string;
    newParameters: Parameter[];
}

export const reorderParameters = ({ canvasItemId, newParameters }: ReorderParametersParams) => {
    const itemsState = useItemsStore.getState();

    const scenes = itemsState.scenes;
    const currentSceneId = itemsState.currentSceneId;

    if (!currentSceneId) {
        return;
    }

    const scene = scenes[currentSceneId];

    if (!scene) {
        return;
    }

    const newItems = scene.items.map((sceneItem) => {
        if (sceneItem.id !== canvasItemId) {
            return sceneItem;
        }

        if (sceneItem.kind !== 'node') {
            return sceneItem;
        }

        return {
            ...sceneItem,
            parameters: newParameters,
        };
    });

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
};
