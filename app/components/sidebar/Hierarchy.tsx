'use client';

import React, { memo, Fragment, useCallback, useMemo, useState, useEffect } from 'react';

import { EmptyState } from '@/components/UI/EmptyState';
import { HierarchyItem } from '@/components/sidebar/HierarchyItem';

import { useItemsStore } from '@/store/useItemsStore';
import { useSidebarStore } from '@/store/useSidebarStore';

import { getNodes } from '@/utils/nodes/getNodes';
import { getRangeSelection } from '@/utils/canvas/getRangeSelection';
import { moveNodeUp, moveNodeDown } from '@/utils/nodes/moveNode';
import { deleteSelectedItems } from '@/utils/items/deleteSelectedItems';

import { ArrowBigUp, ArrowBigDown, X, LucideIcon } from 'lucide-react';

interface ActionButton {
    id: string;
    icon: LucideIcon;
    onClick: () => void;
    disabled: boolean;
}

export const Hierarchy = memo(function Hierarchy({ panelId }: { panelId?: string }) {
    const [mounted, setMounted] = useState(false);

    const { currentSceneId, scenes, selectedItemIds, setSelectedItemIds } = useItemsStore();

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const items = scene?.items ?? [];
    const nodes = getNodes(items);

    const filterText = useSidebarStore((state) => (panelId ? state.filterText[panelId] : ''));

    const filteredNodes = useMemo(() => {
        if (!currentSceneId) return [];

        const scene = scenes[currentSceneId];
        const items = scene?.items ?? [];

        const nodes = getNodes(items);
        const lowerText = filterText?.toLowerCase() || '';

        return nodes.filter((item) => item.name.toLowerCase().includes(lowerText));
    }, [currentSceneId, scenes, filterText]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const deselect = useCallback(
        (e: React.MouseEvent<HTMLUListElement>) => {
            if (e.target === e.currentTarget) {
                setSelectedItemIds([]);
            }
        },
        [setSelectedItemIds],
    );

    const selectItem = (nodeId: string, ctrlKey: boolean, shiftKey: boolean) => {
        if (ctrlKey) {
            const newSet = new Set(selectedItemIds);
            const wasDeleted = newSet.delete(nodeId);

            if (!wasDeleted) newSet.add(nodeId);

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
    const lastSelectedId = selectedNodesList[selectedItemIds.length - 1];

    const firstSelectedIndex = firstSelectedId ? filteredNodes.findIndex((node) => node.id === firstSelectedId) : -1;
    const lastSelectedIndex = lastSelectedId ? filteredNodes.findIndex((node) => node.id === lastSelectedId) : -1;

    const handleMoveUp = useCallback(() => {
        if (selectedItemIds.length === 0 || firstSelectedIndex <= 0) return;

        let newItems = items;

        for (const nodeId of selectedItemIds) {
            newItems = moveNodeUp(newItems, nodeId);
        }

        if (currentSceneId) {
            const updatedScene = {
                ...scene!,
                items: newItems,
                updatedAt: new Date(),
            };
            useItemsStore.setState({ scenes: { ...scenes, [currentSceneId]: updatedScene } });
        }
    }, [items, currentSceneId, scenes, selectedItemIds, firstSelectedIndex, scene]);

    const handleMoveDown = useCallback(() => {
        if (selectedItemIds.length === 0 || lastSelectedIndex >= filteredNodes.length - 1) return;

        let newItems = items;
        const reversedIds = [...selectedItemIds].reverse();

        for (const nodeId of reversedIds) {
            newItems = moveNodeDown(newItems, nodeId);
        }

        if (currentSceneId) {
            const updatedScene = {
                ...scene!,
                items: newItems,
                updatedAt: new Date(),
            };
            useItemsStore.setState({ scenes: { ...scenes, [currentSceneId]: updatedScene } });
        }
    }, [items, currentSceneId, scenes, selectedItemIds, lastSelectedIndex, filteredNodes.length, scene]);

    const actionButtons: ActionButton[] = [
        {
            id: 'move-up',
            icon: ArrowBigUp,
            onClick: handleMoveUp,
            disabled: selectedItemIds.length === 0 || firstSelectedIndex <= 0,
        },
        {
            id: 'move-down',
            icon: ArrowBigDown,
            onClick: handleMoveDown,
            disabled: selectedItemIds.length === 0 || lastSelectedIndex >= filteredNodes.length - 1,
        },
        {
            id: 'delete',
            icon: X,
            onClick: deleteSelectedItems,
            disabled: selectedItemIds.length === 0,
        },
    ];

    if (!mounted) {
        return <div className="flex flex-col h-full" />;
    }

    const shouldShowActions = filteredNodes.length !== 0;

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            {shouldShowActions && (
                <div className="flex gap-1 m-1">
                    {actionButtons.map((button) => (
                        <button
                            key={button.id}
                            onClick={button.onClick}
                            disabled={button.disabled}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.75 bg-depth-2 hover:bg-depth-3 active:bg-depth-4 rounded-md border border-depth-3 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <button.icon size={16} strokeWidth={3} fill="currentColor" />
                        </button>
                    ))}
                </div>
            )}

            <ul className="flex flex-col gap-1 mx-1 mb-1 overflow-y-auto" onClick={deselect}>
                {filteredNodes.length > 0 ? (
                    filteredNodes.map((filteredNode, index) => (
                        <HierarchyItem
                            key={filteredNode.id}
                            filteredNode={filteredNode}
                            index={index}
                            selectItem={selectItem}
                        />
                    ))
                ) : (
                    <EmptyState
                        message={
                            nodes.length === 0
                                ? 'Создайте элемент, нажав ПКМ по холсту.'
                                : `Не найдено элементов по запросу "${filterText}"`
                        }
                    />
                )}
            </ul>
        </div>
    );
});
