import { getSelectedNodes } from '@/canvas/utils/nodes/getSelectedNodes';
import { useCanvasStore } from '@/canvas/store/canvasStore';

export const getSelectedNodesIds = (): string[] => {
    const state = useCanvasStore.getState();

    const items = state.items;
    const selectedItemIds = state.selectedItemIds;

    return getSelectedNodes(items, selectedItemIds).map((node) => node.id);
};
