import { v4 as uuid } from 'uuid';
import type { CanvasItem } from '@/canvas/_core/_/canvas.types';
import { NODE_MOVE_MAX_STEP } from '@/canvas/_core/_/canvas.constants';

import { useItemsStore } from '@/canvas/store/useItemsStore';
import { useClipboardStore } from '@/canvas/store/useClipboardStore';

import { canAddItems } from '@/canvas/utils/items/canAddItems';
import { addToHistory } from '@/canvas/utils/history/historyManager';

export function copySelectedItems(items: CanvasItem[], selectedIds: string[]) {
    const setClipboard = useClipboardStore.getState().setClipboard;

    const snapshot = items.filter((item) => selectedIds.includes(item.id)).map((item) => structuredClone(item));

    setClipboard(snapshot);
}

function generateNewIds(items: CanvasItem[]): Map<string, string> {
    const map = new Map<string, string>();
    items.forEach((item) => map.set(item.id, uuid()));
    return map;
}

function updateEdges(item: CanvasItem, idMapping: Map<string, string>): CanvasItem {
    if (!item.edges?.length) return item;

    return {
        ...item,
        edges: item.edges.map((edge) => ({
            ...edge,
            id: uuid(),
            to: idMapping.get(edge.to) || edge.to,
        })),
    };
}

export function pasteClipboardItems() {
    const clipboardState = useClipboardStore.getState();
    const itemsState = useItemsStore.getState();

    const clipboard = clipboardState.clipboard;

    const items = itemsState.items;
    const setItems = itemsState.setItems;
    const setSelectedItemIds = itemsState.setSelectedItemIds;

    if (!clipboard.length || !canAddItems(clipboard.length)) return;

    const newIds = generateNewIds(clipboard);

    const newItems: CanvasItem[] = clipboard.map((item) => {
        const newId = newIds.get(item.id)!;
        const clone = structuredClone(item);

        clone.id = newId;
        clone.position = {
            x: clone.position.x + NODE_MOVE_MAX_STEP,
            y: clone.position.y + NODE_MOVE_MAX_STEP,
        };

        return updateEdges(clone, newIds);
    });

    addToHistory({
        type: 'PASTE_ITEMS',
        items: structuredClone(newItems),
    });

    setItems([...items, ...newItems]);
    setSelectedItemIds(newItems.map((item) => item.id));
}
