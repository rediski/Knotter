export interface SelectionOptions<T> {
    items: T[];
    selectedIds: string[];
    targetId: string;
    getItemId: (item: T) => string;
    shiftKey: boolean;
    ctrlKey: boolean;
    metaKey?: boolean;
}

export function updateSelection<T>(options: SelectionOptions<T>): string[] {
    const { items, selectedIds, targetId, getItemId, shiftKey, ctrlKey, metaKey = false } = options;

    if (ctrlKey || metaKey) {
        const newSelection = new Set(selectedIds);

        newSelection.has(targetId) ? newSelection.delete(targetId) : newSelection.add(targetId);

        return Array.from(newSelection);
    }

    if (shiftKey && selectedIds.length > 0) {
        const idToIndex = new Map(items.map((item, index) => [getItemId(item), index]));
        const lastSelectedId = selectedIds[selectedIds.length - 1];
        const start = idToIndex.get(lastSelectedId);
        const end = idToIndex.get(targetId);

        if (start !== undefined && end !== undefined) {
            const [from, to] = start < end ? [start, end] : [end, start];
            const newSelection = new Set(selectedIds);

            items.slice(from, to + 1).forEach((item) => newSelection.add(getItemId(item)));

            return Array.from(newSelection);
        }
    }

    return [targetId];
}
