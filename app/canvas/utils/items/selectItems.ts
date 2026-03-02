import { useItemsStore } from '@/canvas/store/useItemsStore';
import { useCanvasStore } from '@/canvas/store/useCanvasStore';

export interface SelectCanvasItemEvent {
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
}

export interface SelectCanvasItemParams {
    itemId: string;
    event: SelectCanvasItemEvent;
}

export function selectItems(params: SelectCanvasItemParams): string[] {
    const { itemId, event: e } = params;

    const itemsState = useItemsStore.getState();

    const items = itemsState.items;
    const selectedItemIds = itemsState.selectedItemIds;

    const item = items.find((i) => i.id === itemId);

    if (!item) return [...selectedItemIds];

    const idToIndex = new Map(items.map((i, index) => [i.id, index]));

    if (e.shiftKey && selectedItemIds.length > 0) {
        const lastSelectedId = selectedItemIds[selectedItemIds.length - 1];
        const start = idToIndex.get(lastSelectedId);
        const end = idToIndex.get(itemId);

        if (start !== undefined && end !== undefined) {
            const [from, to] = start < end ? [start, end] : [end, start];

            const newSelection = new Set(selectedItemIds);

            items.slice(from, to + 1).forEach((i) => newSelection.add(i.id));

            return Array.from(newSelection);
        }

        return [...selectedItemIds];
    }

    if (e.ctrlKey || e.metaKey) {
        const newSelection = new Set(selectedItemIds);

        if (newSelection.has(itemId)) {
            newSelection.delete(itemId);
        }

        if (!newSelection.has(itemId)) {
            newSelection.add(itemId);
        }

        return Array.from(newSelection);
    }

    return [itemId];
}
