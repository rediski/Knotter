'use client';

import { memo } from 'react';

import { EmptyState } from '@/components/UI/EmptyState';
import { HierarchyItem } from '@/canvas/components/Hierarchy/HierarchyItem';

import { useHierarchy } from '@/canvas/hooks/Hierarchy/useHierarchy';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { useCanvasStore } from '@/canvas/store/canvasStore';

interface HierarchyProps {
    panelId?: string;
}

export const Hierarchy = memo(function Hierarchy({ panelId }: HierarchyProps) {
    const items = useCanvasStore((state) => state.items);

    const filterText = useCanvasStore((state) => (panelId ? state.filterText[panelId] : ''));

    const {
        filteredItems,
        selectedIds,
        handleItemChange,
        handleItemSelect,
        handleItemKeyDown,
        handleDeselectOnEmptyClick,
        handleDragEnd,
    } = useHierarchy(filterText);

    const sensors = useSensors(useSensor(PointerSensor));

    return (
        <div className="flex flex-col flex-1 h-full">
            <hr className="border-b-0 border-depth-3" />

            <div className="flex flex-col flex-1 overflow-y-auto gap-2 pt-1" onClick={handleDeselectOnEmptyClick}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToParentElement]}
                >
                    <SortableContext items={filteredItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                        {filteredItems.length !== 0 && (
                            <ul className="flex flex-col gap-1 m-1 mt-0">
                                {filteredItems.map((item) => (
                                    <HierarchyItem
                                        key={item.id}
                                        canvasItem={item}
                                        isSelected={selectedIds.includes(item.id)}
                                        onSelect={(e) => handleItemSelect(e, item.id)}
                                        onChange={handleItemChange}
                                        onKeyDown={(e) => handleItemKeyDown(e, item)}
                                    />
                                ))}
                            </ul>
                        )}

                        {items.length === 0 && <EmptyState message="Создайте элемент, нажав ПКМ по холсту." />}

                        {filteredItems.length === 0 && items.length !== 0 && (
                            <EmptyState message={`Не найдено элементов по запросу "${filterText}"`} />
                        )}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
});
