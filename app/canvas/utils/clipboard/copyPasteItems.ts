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
    const store = useCanvasStore.getState();
    const { clipboard, setSelectedItemIds, setItems, items } = store;

    if (!clipboard.length) return;

    const newItems: CanvasItem[] = clipboard.map((item) => {
        const clone = structuredClone(item);
        clone.id = uuid();

        clone.position = {
            x: clone.position.x + insertionGap,
            y: clone.position.y + insertionGap,
        };

        return clone;
    });

    addToHistory({
        type: 'PASTE_ITEMS',
        items: structuredClone(newItems),
    });

    setItems([...items, ...newItems]);

    setSelectedItemIds(newItems.map((item) => item.id));
}
