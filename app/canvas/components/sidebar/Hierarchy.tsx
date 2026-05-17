'use client';

import { memo, Fragment, useCallback } from 'react';

import { EmptyState } from '@/components/UI/EmptyState';
import { HierarchyItem } from '@/canvas/components/sidebar/HierarchyItem';

import { useHierarchy } from '@/canvas/components/sidebar/useHierarchy';
import { useSidebarStore } from '@/canvas/store/useSidebarStore';
import { useItemsStore } from '@/canvas/store/useItemsStore';
import { getNodes } from '@/canvas/utils/nodes/getNodes';
import { moveNodeUp, moveNodeDown } from '@/canvas/utils/nodes/moveNode';
import { getRangeSelection } from '@/canvas/utils/canvas/getRangeSelection';

import { ArrowBigUp, ArrowBigDown } from 'lucide-react';

export const Hierarchy = memo(function Hierarchy({ panelId }: { panelId?: string }) {
    const items = useItemsStore((state) => state.items);
    const setItems = useItemsStore((state) => state.setItems);
    const selectedItemIds = useItemsStore((state) => state.selectedItemIds);
    const setSelectedItemIds = useItemsStore((state) => state.setSelectedItemIds);

    const nodes = getNodes(items);

    const filterText = useSidebarStore((state) => (panelId ? state.filterText[panelId] : ''));
    const { filteredNodes, deselect } = useHierarchy(filterText);

    const selectItem = (nodeId: string, ctrlKey: boolean, shiftKey: boolean) => {
        if (ctrlKey) {
            const newSet = new Set(selectedItemIds);
            const wasDeleted = newSet.delete(nodeId);

            if (!wasDeleted) {
                newSet.add(nodeId);
            }

            setSelectedItemIds(Array.from(newSet));
            return;
        }

        if (shiftKey && selectedItemIds.length > 0) {
            const lastSelectedId = selectedItemIds[selectedItemIds.length - 1];
            const rangeSet = getRangeSelection(filteredNodes, nodeId, lastSelectedId);

            if (rangeSet.size > 0) {
                setSelectedItemIds(Array.from(rangeSet));
            }

            return;
        }

        setSelectedItemIds([nodeId]);
    };

    const selectedNodesList = selectedItemIds;
    const firstSelectedId = selectedNodesList[0];
    const lastSelectedId = selectedNodesList[selectedNodesList.length - 1];

    const firstSelectedIndex = firstSelectedId ? filteredNodes.findIndex((node) => node.id === firstSelectedId) : -1;
    const lastSelectedIndex = lastSelectedId ? filteredNodes.findIndex((node) => node.id === lastSelectedId) : -1;

    const handleMoveUp = useCallback(() => {
        if (selectedItemIds.length === 0) return;
        if (firstSelectedIndex <= 0) return;

        let newItems = items;

        for (const nodeId of selectedItemIds) {
            newItems = moveNodeUp(newItems, nodeId);
        }

        setItems(newItems);
    }, [items, setItems, selectedItemIds, firstSelectedIndex]);

    const handleMoveDown = useCallback(() => {
        if (selectedItemIds.length === 0) return;
        if (lastSelectedIndex >= filteredNodes.length - 1) return;

        let newItems = items;
        const reversedIds = [...selectedItemIds].reverse();

        for (const nodeId of reversedIds) {
            newItems = moveNodeDown(newItems, nodeId);
        }

        setItems(newItems);
    }, [items, setItems, selectedItemIds, lastSelectedIndex, filteredNodes.length]);

    return (
        <div className="flex flex-col h-full">
            {filteredNodes.length !== 0 && (
                <div className="flex gap-1 m-1">
                    <button
                        onClick={handleMoveUp}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.75 bg-depth-2 hover:bg-depth-3 active:bg-depth-4 rounded-md border border-depth-3 cursor-pointer"
                        title="Вверх"
                    >
                        <ArrowBigUp size={16} fill="currentColor" />
                    </button>

                    <button
                        onClick={handleMoveDown}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.75 bg-depth-2 hover:bg-depth-3 active:bg-depth-4 rounded-md border border-depth-3 cursor-pointer"
                        title="Вниз"
                    >
                        <ArrowBigDown size={16} fill="currentColor" />
                    </button>
                </div>
            )}

            <ul className="flex flex-col gap-1 mx-1 mb-1 overflow-y-auto flex-1" onClick={deselect}>
                {filteredNodes.length !== 0 && (
                    <Fragment>
                        {filteredNodes.map((filteredNode, index) => (
                            <HierarchyItem
                                key={filteredNode.id}
                                filteredNode={filteredNode}
                                index={index}
                                selectItem={selectItem}
                            />
                        ))}
                    </Fragment>
                )}

                {nodes.length === 0 && <EmptyState message="Создайте элемент, нажав ПКМ по холсту." />}

                {filteredNodes.length === 0 && nodes.length !== 0 && (
                    <EmptyState message={`Не найдено элементов по запросу "${filterText}"`} />
                )}
            </ul>
        </div>
    );
});
