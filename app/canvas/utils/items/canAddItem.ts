import { MAX_CANVAS_ITEMS } from '@/canvas/_core/_/canvas.constants';
import { useCanvasStore } from '@/canvas/store/canvasStore';

export function canAddItem(): boolean {
    const { items } = useCanvasStore.getState();

    if (items.length >= MAX_CANVAS_ITEMS) {
        console.warn(`Достигнут лимит элементов на канвасе (${MAX_CANVAS_ITEMS}). Новый элемент добавлен не будет.`);
        return false;
    }

    return true;
}
