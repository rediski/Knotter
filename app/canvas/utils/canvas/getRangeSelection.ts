export const getRangeSelection = (items: Array<{ id: string }>, currentId: string, lastSelectedId: string): Set<string> => {
    const currentIndex = items.findIndex((item) => item.id === currentId);
    const lastIndex = items.findIndex((item) => item.id === lastSelectedId);

    if (currentIndex === -1 || lastIndex === -1) {
        return new Set();
    }

    const start = Math.min(currentIndex, lastIndex);
    const end = Math.max(currentIndex, lastIndex);
    const newSet = new Set<string>();

    for (let i = start; i <= end; i++) {
        newSet.add(items[i].id);
    }

    return newSet;
};
