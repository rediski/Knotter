'use client';

import { memo } from 'react';

import type { CanvasItem } from '@/canvas/_core/_/canvas.types';

import { EditableName } from '@/components/UI/EditableName';
import { useHierarchyItem } from '@/canvas/CanvasSidebar/Hierarchy/useHierarchyItem';
import { getDynamicIcon } from '@/canvas/utils/items/getDynamicIcon';
import { useCanvasStore } from '@/canvas/store/canvasStore';

interface HierarchyItemProps {
    canvasItem: CanvasItem;
}

export const HierarchyItem = memo(function HierarchyItem({ canvasItem }: HierarchyItemProps) {
    const { isSelected, handleSelect, handleKeyDown, handleNameChange, dragRef, dropRef, isDragOver, dragPosition } =
        useHierarchyItem(canvasItem);

    const Icon = getDynamicIcon(canvasItem.kind);

    const openedNodesIds = useCanvasStore((state) => state.openedNodesIds);
    const setOpenedNodesIds = useCanvasStore((state) => state.setOpenedNodesIds);
    const setOpenedNodeId = useCanvasStore((state) => state.setOpenedNodeId);
    const setSelectedItemIds = useCanvasStore((state) => state.setSelectedItemIds);

    const handleNodeDoubleClick = (nodeId: string) => {
        if (canvasItem.kind !== 'node') return;

        if (!openedNodesIds.includes(nodeId)) {
            setOpenedNodesIds([...openedNodesIds, nodeId]);
        }

        setOpenedNodeId(nodeId);
        setSelectedItemIds([nodeId]);
    };

    return (
        <li
            ref={dropRef}
            className="relative select-none"
            onClick={handleSelect}
            onKeyDown={handleKeyDown}
            onDoubleClick={() => handleNodeDoubleClick(canvasItem.id)}
        >
            {isDragOver && (
                <div
                    className={`absolute left-0 right-0 h-0.5 bg-bg-accent ${dragPosition === 'top' ? 'top-0' : 'bottom-0'}`}
                />
            )}

            <div ref={dragRef} draggable className="cursor-grab active:cursor-grabbing">
                <button
                    className={`pointer-events-none w-full px-3 h-9 rounded-md outline-none tabular-nums
                        ${
                            isSelected
                                ? 'bg-bg-accent/10 focus-visible:bg-bg-accent/15'
                                : 'bg-depth-2 hover:bg-depth-3 focus-visible:bg-border'
                        }
                    `}
                >
                    <div className="flex items-center gap-2 w-full pointer-events-none">
                        <Icon size={16} />

                        <div className={`border-l h-5 ${isSelected ? 'border-bg-accent/10' : 'border-depth-4'}`} />

                        <EditableName name={canvasItem.name} isSelected={isSelected} onChange={handleNameChange} />
                    </div>
                </button>
            </div>
        </li>
    );
});
