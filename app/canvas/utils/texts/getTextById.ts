import type { Text, CanvasItem } from '@/canvas/_core/_/canvas.types';

export function getTextById(items: CanvasItem[], id: string): Text | undefined {
    const item = items.find((item) => item.id === id);
    return item?.kind === 'text' ? (item as Text) : undefined;
}
