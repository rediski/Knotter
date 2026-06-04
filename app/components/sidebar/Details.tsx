'use client';

import { useState, useMemo } from 'react';

import { EmptyState } from '@/components/UI/EmptyState';
import { CodeBlock } from '@/components/UI/CodeBlock';
import { KeyFilters } from '@/components/sidebar/KeyFilters';

import { useItemsStore } from '@/store/useItemsStore';
import { getSelectedItems } from '@/utils/items/getSelectedItems';

export const Details = () => {
    const { currentSceneId, scenes, selectedItemIds } = useItemsStore();

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const items = scene?.items ?? [];

    const selectedItems = useMemo(() => getSelectedItems({ items, selectedItemIds }), [items, selectedItemIds]);
    const [filteredSelectedItems, setFilteredSelectedItems] = useState(selectedItems);

    if (items.length === 0) {
        return <EmptyState message="Создайте хотя бы один элемент" />;
    }

    if (selectedItems.length === 0) {
        return <EmptyState message="Необходимо выбрать один из элементов" />;
    }

    return (
        <div className="flex gap-1 overflow-y-auto m-1 h-full">
            <KeyFilters data={selectedItems} onFilterChange={setFilteredSelectedItems} />

            <div className="relative bg-depth-2 border border-depth-3 rounded-md w-full h-fit">
                <CodeBlock data={filteredSelectedItems} />
            </div>
        </div>
    );
};
