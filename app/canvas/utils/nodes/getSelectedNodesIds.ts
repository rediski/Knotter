import { getSelectedNodes } from '@/canvas/utils/nodes/getSelectedNodes';

export const getSelectedNodesIds = (): string[] => {
    const selectedNodes = getSelectedNodes();
    return selectedNodes.map((node) => node.id);
};
