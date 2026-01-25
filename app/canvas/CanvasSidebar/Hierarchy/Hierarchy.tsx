'use client';

import { memo } from 'react';

import { EmptyState } from '@/components/UI/EmptyState';
import { HierarchyItem } from '@/canvas/CanvasSidebar/Hierarchy/HierarchyItem';

import { useHierarchy } from '@/canvas/CanvasSidebar/Hierarchy/useHierarchy';
import { useCanvasStore } from '@/canvas/store/canvasStore';

interface HierarchyProps {
    panelId?: string;
}

export const Hierarchy = memo(function Hierarchy({ panelId }: HierarchyProps) {
    const items = useCanvasStore((state) => state.items);
    const filterText = useCanvasStore((state) => (panelId ? state.filterText[panelId] : ''));
    const { filteredItems, handleDeselectOnEmptyClick } = useHierarchy(filterText);

    return (
        <div className="flex flex-col flex-1 h-full">
            <hr className="border-b-0 border-depth-3 mt-1" />

            <div className="flex flex-col flex-1 overflow-y-auto gap-2" onClick={handleDeselectOnEmptyClick}>
                {filteredItems.length !== 0 && (
                    <ul className="flex flex-col gap-1 m-1">
                        {filteredItems.map((item) => (
                            <HierarchyItem key={item.id} canvasItem={item} />
                        ))}
                    </ul>
                )}

                {items.length === 0 && <EmptyState message="Создайте элемент, нажав ПКМ по холсту." />}

                {filteredItems.length === 0 && items.length !== 0 && (
                    <EmptyState message={`Не найдено элементов по запросу "${filterText}"`} />
                )}
            </div>
        </div>
    );
});
