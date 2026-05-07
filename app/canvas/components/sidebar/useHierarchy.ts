'use client';

import { useMemo, type MouseEvent } from 'react';
import { useItemsStore } from '@/canvas/store/useItemsStore';
import { getNodes } from '@/canvas/utils/nodes/getNodes';

export function useHierarchy(filterText: string) {
    const items = useItemsStore((state) => state.items);
    const setSelectedIds = useItemsStore((state) => state.setSelectedItemIds);

    const nodes = getNodes(items);

    const filteredNodes = useMemo(() => {
        const filteredText = filterText?.toLowerCase() || '';

        return nodes.filter((item) => item.name.toLowerCase().includes(filteredText));
    }, [nodes, filterText]);

    const deselect = (e: MouseEvent<HTMLUListElement>) => {
        if (e.target === e.currentTarget) {
            setSelectedIds([]);
        }
    };

    return {
        filteredNodes,
        deselect,
    };
}
