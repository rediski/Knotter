import type { CanvasItem } from '@/canvas/_core/_/canvas.types';
import { NODE_MOVE_MAX_STEP } from '@/canvas/_core/_/canvas.constants';

import { useCanvasStore } from '@/canvas/store/canvasStore';

import { addToHistory } from '@/canvas/utils/clipboard/historyManager';

import { createNode } from '@/canvas/utils/nodes/createNode';
import { createText } from '@/canvas/utils/texts/createText';

export function copySelectedItems(items: CanvasItem[], selectedIds: string[]) {
    const setClipboard = useCanvasStore.getState().setClipboard;
    const selected = items.filter((item) => selectedIds.includes(item.id));
    setClipboard(selected);
}

export function pasteClipboardItems(insertionGap = NODE_MOVE_MAX_STEP) {
    const clipboard = useCanvasStore.getState().clipboard;

    if (!clipboard.length) return;

    const { setSelectedItemIds } = useCanvasStore.getState();
    const newItems: CanvasItem[] = [];

    clipboard.forEach((item) => {
        let newItem: CanvasItem | null = null;

        if (item.kind === 'node') {
            newItem = createNode();
        }

        if (item.kind === 'text') {
            newItem = createText(item.content || '');
        }

        if (!newItem) return;

        newItem.position = {
            x: (item.position?.x ?? 0) + insertionGap,
            y: (item.position?.y ?? 0) + insertionGap,
        };

        newItems.push(newItem);
    });

    if (!newItems.length) return;

    addToHistory({
        type: 'PASTE_ITEMS',
        items: newItems,
    });

    setSelectedItemIds(newItems.map((item) => item.id));
}
