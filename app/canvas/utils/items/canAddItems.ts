import { MAX_CANVAS_ITEMS } from '@/canvas/_core/_/canvas.constants';
import { useItemsStore } from '@/canvas/store/useItemsStore';

export function canAddItem(): boolean {
    return canAddItems(1);
}

export function canAddItems(count: number): boolean {
    const items = useItemsStore.getState().items;

    if (items.length + count > MAX_CANVAS_ITEMS) {
        console.warn(
            `Невозможно добавить ${count} элементов. ` + `Текущее количество: ${items.length}, лимит: ${MAX_CANVAS_ITEMS}.`,
        );
        return false;
    }

    return true;
}
