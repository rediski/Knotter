import { useCanvasStore } from '@/canvas/store/canvasStore';
import type { CanvasItem } from '@/canvas/_core/_/canvas.types';

export function getSelectedItems(): CanvasItem[] {
    const items = useCanvasStore.getState().items;
    const selectedItemIds = useCanvasStore.getState().selectedItemIds;

    return items.filter((item) => selectedItemIds.includes(item.id));
}
