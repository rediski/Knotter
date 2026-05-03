import { useItemsStore } from '@/canvas/store/useItemsStore';
import type { Node } from '@/canvas/_core/_/canvas.types';

export const getNodeById = (nodeId: string): Node | undefined => {
    const itemsState = useItemsStore.getState();
    const items = itemsState.items;

    const node = items.find((item): item is Node => item.id === nodeId && item.kind === 'node');

    return node;
};
