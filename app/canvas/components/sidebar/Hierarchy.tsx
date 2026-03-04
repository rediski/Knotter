'use client';

import React, { memo } from 'react';

import { EmptyState } from '@/components/UI/EmptyState';
import { HierarchyItem } from '@/canvas/components/sidebar/HierarchyItem';

import { useHierarchy } from '@/canvas/components/sidebar/useHierarchy';
import { useSidebarStore } from '@/canvas/store/useSidebarStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';

export const Hierarchy = memo(function Hierarchy({ panelId }: { panelId?: string }) {
    const items = useItemsStore((state) => state.items);
    const filterText = useSidebarStore((state) => (panelId ? state.filterText[panelId] : ''));
    const { filteredItems, deselect } = useHierarchy(filterText);

    return (
        <ul className="flex flex-col gap-1 p-1 overflow-y-auto h-full" onClick={deselect}>
            {filteredItems.length !== 0 && (
                <React.Fragment>
                    {filteredItems.map((filteredItem) => (
                        <HierarchyItem key={filteredItem.id} canvasItem={filteredItem} />
                    ))}
                </React.Fragment>
            )}

            {items.length === 0 && <EmptyState message="Создайте элемент, нажав ПКМ по холсту." />}

            {filteredItems.length === 0 && items.length !== 0 && (
                <EmptyState message={`Не найдено элементов по запросу "${filterText}"`} />
            )}
        </ul>
    );
});
