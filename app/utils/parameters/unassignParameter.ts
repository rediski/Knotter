import { isStructure } from '@/_core/_/parameter.type-guards';
import { useItemsStore } from '@/store/useItemsStore';
import { getSelectedNode } from '@/utils/nodes/getSelectedNodes';

export const unassignParameter = (parameterId: string) => {
    const { currentSceneId, scenes, selectedItemIds, parameters: allParameters } = useItemsStore.getState();

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    const node = getSelectedNode({ items, selectedItemIds });

    if (!node) return;

    const getIdsToRemove = (id: string): string[] => {
        const parameter = allParameters.find((p) => p.id === id);
        if (!parameter) return [id];

        if (isStructure(parameter)) {
            const childIds = parameter.defaultValue.flatMap((childId) => getIdsToRemove(childId));
            return [id, ...childIds];
        }

        return [id];
    };

    const idsToRemove = getIdsToRemove(parameterId);

    const updatedItems = items.map((item) => {
        if (item.kind === 'node' && item.id === node.id) {
            return {
                ...item,
                parameters: item.parameters.filter((parameter) => !idsToRemove.includes(parameter.id)),
            };
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
};
