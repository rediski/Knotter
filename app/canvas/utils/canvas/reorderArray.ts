export function reorderArray<T extends { id: string }>(
    array: T[],
    draggedId: string,
    targetId: string,
    position: 'top' | 'bottom' | null,
): T[] {
    const fromIndex = array.findIndex((item) => item.id === draggedId);
    const toIndex = array.findIndex((item) => item.id === targetId);

    if (fromIndex === -1 || toIndex === -1) return array;

    const updated = [...array];
    const [moved] = updated.splice(fromIndex, 1);

    const insertIndex = position === 'top' ? toIndex : toIndex + 1;

    updated.splice(insertIndex, 0, moved);

    return updated;
}
