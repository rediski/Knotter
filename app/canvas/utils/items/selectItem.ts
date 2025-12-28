import { CanvasItem } from '@/canvas/canvas.types';

export interface SelectCanvasItemEvent {
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
}

export interface SelectCanvasItemParams<T extends CanvasItem> {
    items?: readonly T[];
    selectedIds?: readonly string[];
    itemId: string;
    event: SelectCanvasItemEvent;
}

export function selectCanvasItem<T extends CanvasItem>(params: SelectCanvasItemParams<T>): string[] {
    const { items = [], selectedIds = [], itemId, event: e } = params;

    const item = items.find((i) => i.id === itemId);

    if (!item) return [...selectedIds];

    const idToIndex = new Map(items.map((i, index) => [i.id, index]));

    if (e.shiftKey && selectedIds.length > 0) {
        const lastSelectedId = selectedIds[selectedIds.length - 1];
        const start = idToIndex.get(lastSelectedId);
        const end = idToIndex.get(itemId);

        if (start !== undefined && end !== undefined) {
            const [from, to] = start < end ? [start, end] : [end, start];

            const newSelection = new Set(selectedIds);

            items.slice(from, to + 1).forEach((i) => newSelection.add(i.id));

            return Array.from(newSelection);
        }

        return [...selectedIds];
    }

    if (e.ctrlKey || e.metaKey) {
        const newSelection = new Set(selectedIds);

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
