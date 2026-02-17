import type { CanvasItem } from '@/canvas/_core/_/canvas.types';

export const isMovableItem = (item: CanvasItem): item is Exclude<CanvasItem, { kind: 'edge' }> => {
    return item.kind !== 'edge';
};
