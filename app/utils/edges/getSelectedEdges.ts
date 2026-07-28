import type { Edge } from '@/_core/_/canvas.types';
import { getSelectedItems } from '@/utils/items/getSelectedItems';

export const getSelectedEdges = (): Edge[] => {
    const selectedItems = getSelectedItems();
    const selectedEdges = selectedItems.filter((item): item is Edge => item.kind === 'edge');

    return selectedEdges;
};

export const getSelectedEdgesIds = (): string[] => {
    const selectedEdges = getSelectedEdges();
    return selectedEdges.map((edge) => edge.id);
};

export const getSelectedEdge = (): Edge | null => {
    const selectedEdges = getSelectedEdges();

    return selectedEdges[0] || null;
};
