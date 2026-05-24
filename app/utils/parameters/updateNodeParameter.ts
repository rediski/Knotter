import type { NodeParameterValue } from '@/_core/_/parameter';
import type { Node } from '@/_core/_/canvas.types';

import { useItemsStore } from '@/store/useItemsStore';

export const updateNodeParameter = <T extends keyof NodeParameterValue>(
    nodeId: string,
    parameterId: string,
    value: NodeParameterValue[T],
) => {
    const { currentSceneId, scenes } = useItemsStore.getState();

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    const nodeIndex = items.findIndex((item) => item.kind === 'node' && item.id === nodeId);
    if (nodeIndex === -1) return;

    const currentNode = items[nodeIndex] as Node;

    const updatedNodeParameters = currentNode.parameters.map((param) =>
        param.id === parameterId ? { ...param, value } : param,
    );

    const updatedNode: Node = {
        ...currentNode,
        parameters: updatedNodeParameters,
    };

    const updatedItems = [...items];
    updatedItems[nodeIndex] = updatedNode;

    if (scene) {
        const updatedScene = {
            ...scene,
            items: updatedItems,
            updatedAt: new Date(),
        };
        useItemsStore.setState({ scenes: { ...scenes, [currentSceneId]: updatedScene } });
    }
};
