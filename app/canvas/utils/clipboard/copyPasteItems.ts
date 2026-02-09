import type { CanvasItem } from '@/canvas/_core/_/canvas.types';
import { NODE_MOVE_MAX_STEP } from '@/canvas/_core/_/canvas.constants';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { addToHistory } from '@/canvas/utils/clipboard/historyManager';

import { v4 as uuid } from 'uuid';

export function copySelectedItems(items: CanvasItem[], selectedIds: string[]) {
    const setClipboard = useCanvasStore.getState().setClipboard;

    const snapshot = items.filter((item) => selectedIds.includes(item.id)).map((item) => structuredClone(item));

    setClipboard(snapshot);
}

export function pasteClipboardItems(insertionGap = NODE_MOVE_MAX_STEP) {
    const clipboard = useCanvasStore.getState().clipboard;
    if (!clipboard.length) return;

    const { setSelectedItemIds } = useCanvasStore.getState();

    const newItems: CanvasItem[] = clipboard.map((item) => {
        const clone = structuredClone(item);

        clone.id = uuid();
        clone.position = {
            x: (item.position?.x ?? 0) + insertionGap,
            y: (item.position?.y ?? 0) + insertionGap,
        };

        return clone;
    });

    addToHistory({
        type: 'PASTE_ITEMS',
        items: structuredClone(newItems),
    });

    useCanvasStore.getState().setItems([...useCanvasStore.getState().items, ...newItems]);

    setSelectedItemIds(newItems.map((item) => item.id));
}
