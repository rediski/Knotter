'use client';

import React, { memo } from 'react';

import { EmptyState } from '@/components/UI/EmptyState';
import { HierarchyItem } from '@/canvas/CanvasSidebar/Hierarchy/HierarchyItem';

import { useHierarchy } from '@/canvas/CanvasSidebar/Hierarchy/useHierarchy';
import { useCanvasStore } from '@/canvas/store/canvasStore';

export const Hierarchy = memo(function Hierarchy({ panelId }: { panelId?: string }) {
    const items = useCanvasStore((state) => state.items);
    const filterText = useCanvasStore((state) => (panelId ? state.filterText[panelId] : ''));
    const { filteredItems, deselect } = useHierarchy(filterText);

    return (
        <ul className="flex flex-col gap-1 p-1 overflow-y-auto h-full" onClick={deselect}>
            {filteredItems.length !== 0 && (
                <React.Fragment>
                    {filteredItems.map((item) => (
                        <HierarchyItem key={item.id} canvasItem={item} />
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
