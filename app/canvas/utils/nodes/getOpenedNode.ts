import type { Node } from '@/canvas/_core/_/canvas.types';
import { useCanvasStore } from '@/canvas/store/useCanvasStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';

export const getOpenedNode = (): Node | null => {
    const items = useItemsStore.getState().items;
    const selectedTabId = useCanvasStore.getState().selectedTabId;

    const openedNode = items.find((item): item is Node => item.id === selectedTabId && item.kind === 'node');

    return openedNode ?? null;
};
