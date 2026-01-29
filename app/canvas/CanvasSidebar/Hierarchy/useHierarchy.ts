'use client';

import { useMemo, useCallback } from 'react';
import { useCanvasStore } from '@/canvas/store/canvasStore';

export function useHierarchy(filterText: string) {
    const items = useCanvasStore((state) => state.items);
    const setSelectedIds = useCanvasStore((state) => state.setSelectedItemIds);

    const filteredItems = useMemo(() => {
        const lower = filterText?.toLowerCase() || '';

        return items.filter((item) => item.name.toLowerCase().includes(lower));
    }, [items, filterText]);

    const handleDeselectOnEmptyClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) {
                setSelectedIds([]);
            }
        },
        [setSelectedIds],
    );

    return {
        filteredItems,
        handleDeselectOnEmptyClick,
    };
}
