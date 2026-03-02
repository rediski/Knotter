'use client';

import { useMemo, useCallback } from 'react';
import { useItemsStore } from '@/canvas/store/useItemsStore';

export function useHierarchy(filterText: string) {
    const items = useItemsStore((state) => state.items);
    const setSelectedIds = useItemsStore((state) => state.setSelectedItemIds);

    const filteredItems = useMemo(() => {
        const lower = filterText?.toLowerCase() || '';

        return items.filter((item) => item.name.toLowerCase().includes(lower));
    }, [items, filterText]);

    const deselect = useCallback(
        (e: React.MouseEvent<HTMLUListElement>) => {
            if (e.target === e.currentTarget) {
                setSelectedIds([]);
            }
        },
        [setSelectedIds],
    );

    return {
        filteredItems,
        deselect,
    };
}
