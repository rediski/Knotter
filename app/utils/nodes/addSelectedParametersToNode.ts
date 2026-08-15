import type { Node } from '@/_core/_/canvas.types';

import { useItemsStore } from '@/store/useItemsStore';

export const addSelectedParametersToNode = (nodeId: string) => {
    const { currentSceneId, scenes, parameters, selectedParameters, setSelectedParameters } = useItemsStore.getState();

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];
    if (!scene) return;

    const node = scene.items.find((item) => item.kind === 'node' && item.id === nodeId) as Node | undefined;
    if (!node) return;

    const existingIds = new Set(node.parameters?.map((p) => p.id) || []);

    const paramsToAdd = parameters.filter(
        (p) => selectedParameters.has(p.id) && p.parentId === null && !existingIds.has(p.id),
    );

    if (paramsToAdd.length === 0) return;

    const updatedItems = scene.items.map((item) => {
        if (item.kind === 'node' && item.id === nodeId) {
            return {
                ...item,
                parameters: [...(item.parameters || []), ...paramsToAdd],
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

    setSelectedParameters(new Set());
};
