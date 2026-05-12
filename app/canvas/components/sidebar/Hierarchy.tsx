'use client';

import { memo, Fragment } from 'react';

import { EmptyState } from '@/components/UI/EmptyState';
import { HierarchyItem } from '@/canvas/components/sidebar/HierarchyItem';

import { useHierarchy } from '@/canvas/components/sidebar/useHierarchy';
import { useSidebarStore } from '@/canvas/store/useSidebarStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';
import { getNodes } from '@/canvas/utils/nodes/getNodes';

export const Hierarchy = memo(function Hierarchy({ panelId }: { panelId?: string }) {
    const items = useItemsStore((state) => state.items);
    const nodes = getNodes(items);

    const filterText = useSidebarStore((state) => (panelId ? state.filterText[panelId] : ''));
    const { filteredNodes, deselect } = useHierarchy(filterText);

    return (
        <ul className="flex flex-col gap-1 m-1 overflow-y-auto h-full" onClick={deselect}>
            {filteredNodes.length !== 0 && (
                <Fragment>
                    {filteredNodes.map((filteredNode, index) => (
                        <HierarchyItem key={filteredNode.id} filteredNode={filteredNode} index={index} />
                    ))}
                </Fragment>
            )}

            {nodes.length === 0 && <EmptyState message="Создайте элемент, нажав ПКМ по холсту." />}

            {filteredNodes.length === 0 && nodes.length !== 0 && (
                <EmptyState message={`Не найдено элементов по запросу "${filterText}"`} />
            )}
        </ul>
    );
});
