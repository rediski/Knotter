import { v4 as uuid } from 'uuid';
import type { CanvasItem, Edge } from '@/_core/_/canvas.types';
import { NODE_MOVE_MAX_STEP } from '@/_core/_/canvas.constants';

import { useItemsStore } from '@/store/useItemsStore';
import { useClipboardStore } from '@/store/useClipboardStore';

import { canAddItems } from '@/utils/items/canAddItems';
import { addToHistory } from '@/utils/history/historyManager';

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

export function pasteClipboardItems() {
    const clipboardState = useClipboardStore.getState();
    const { currentSceneId, scenes } = useItemsStore.getState();

    const clipboard = clipboardState.clipboard;

    if (!currentSceneId) return;

    const scene = scenes[currentSceneId];
    const items = scene?.items ?? [];

    const setSelectedItemIds = useItemsStore.getState().setSelectedItemIds;

    if (!clipboard.length || !canAddItems(clipboard.length)) return;

    const newIds = generateNewIds(clipboard);

    const newItems: CanvasItem[] = clipboard.map((item) => {
        const newId = newIds.get(item.id)!;
        const clone = structuredClone(item) as CanvasItem;

        clone.id = newId;

        if (clone.kind === 'node') {
            clone.position = {
                x: clone.position.x + NODE_MOVE_MAX_STEP,
                y: clone.position.y + NODE_MOVE_MAX_STEP,
            };
        }

        return clone;
    });

    addToHistory({
        type: 'PASTE_ITEMS',
        items: structuredClone(newItems),
        timestamp: Date.now(),
    });

    const updatedItems = [...items, ...newItems];

    if (scene) {
        const updatedScene = {
            ...scene,
            items: updatedItems,
            updatedAt: new Date(),
        };
        useItemsStore.setState({ scenes: { ...scenes, [currentSceneId]: updatedScene } });
    }

    setSelectedItemIds(newItems.map((item) => item.id));
}
