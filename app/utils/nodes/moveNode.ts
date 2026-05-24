import type { CanvasItem } from '@/_core/_/canvas.types';
import { getNodes } from '@/utils/nodes/getNodes';

export const moveNodeUp = (items: CanvasItem[], nodeId: string): CanvasItem[] => {
    const nodes = getNodes(items);
    const currentIndex = nodes.findIndex((node) => node.id === nodeId);

    if (currentIndex <= 0) return items;

    const newSiblings = [...nodes];
    [newSiblings[currentIndex - 1], newSiblings[currentIndex]] = [newSiblings[currentIndex], newSiblings[currentIndex - 1]];

    const otherItems = items.filter((item) => item.kind !== 'node');
    return [...newSiblings, ...otherItems];
};

export const moveNodeDown = (items: CanvasItem[], nodeId: string): CanvasItem[] => {
    const nodes = getNodes(items);
    const currentIndex = nodes.findIndex((node) => node.id === nodeId);

    if (currentIndex === -1 || currentIndex >= nodes.length - 1) return items;

    const newSiblings = [...nodes];
    [newSiblings[currentIndex + 1], newSiblings[currentIndex]] = [newSiblings[currentIndex], newSiblings[currentIndex + 1]];

    const otherItems = items.filter((item) => item.kind !== 'node');
    return [...newSiblings, ...otherItems];
};
