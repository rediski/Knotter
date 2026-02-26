import { useCanvasStore } from '@/canvas/store/canvasStore';
import { getNodes } from '@/canvas/utils/nodes/getNodes';

export const getSelectedNode = () => {
    const state = useCanvasStore.getState();
    const selectedItem = state.selectedItem;

    if (selectedItem?.kind !== 'node') return null;

    const nodes = getNodes(state.items);
    const selectedNode = nodes.find((node) => node.id === selectedItem.id);

    return selectedNode || null;
};
