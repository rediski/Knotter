import type { CanvasItem } from '@/canvas/_core/_/canvas.types';

let clipboard: CanvasItem[] = [];

export function setClipboard(items: CanvasItem[]) {
    clipboard = items;
}

export function getClipboard(): CanvasItem[] {
    return clipboard;
}
