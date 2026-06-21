import type { Node, Position } from '@/_core/_/canvas.types';
import { getSelectedItems } from '@/utils/items/getSelectedItems';

export const getSelectedNodes = (): Node[] => {
    const selectedItems = getSelectedItems();
    const selectedNode = selectedItems.filter((item) => item.kind === 'node');

    return selectedNode;
};

export const getSelectedNodesIds = (): string[] => {
    const selectedNodes = getSelectedNodes();
    return selectedNodes.map((node) => node.id);
};

export const getSelectedNode = (): Node | null => {
    const selectedNodes = getSelectedNodes();

    return selectedNodes[0] || null;
};

export function getSelectedNodesPositions(): Map<string, Position> {
    const selectedItems = getSelectedItems();
    const positions = new Map(
        selectedItems.filter((item) => item.kind === 'node').map((item) => [item.id, { ...item.position }]),
    );

    return positions;
}
