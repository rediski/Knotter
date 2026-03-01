'use client';

import { memo } from 'react';

import type { CanvasItem } from '@/canvas/_core/_/canvas.types';

import { EditableName } from '@/components/UI/EditableName';
import { useHierarchyItem } from '@/canvas/components/sidebar/useHierarchyItem';
import { getIcon } from '@/canvas/utils/nodes/getIcon';
import { useCanvasStore } from '@/canvas/store/canvasStore';

interface HierarchyItemProps {
    canvasItem: CanvasItem;
}

export const HierarchyItem = memo(function HierarchyItem({ canvasItem }: HierarchyItemProps) {
    const {
        handleSelect,
        handleKeyDown,
        handleNameChange,
        handleNodeDoubleClick,
        dragRef,
        dropRef,
        isDragOver,
        dragPosition,
    } = useHierarchyItem(canvasItem);

    const Icon = getIcon(canvasItem.kind);
    const selectedItemIds = useCanvasStore((state) => state.selectedItemIds);

    const isSelected = selectedItemIds.includes(canvasItem.id);

    return (
        <li
            ref={dropRef}
            className="relative select-none"
            onClick={handleSelect}
            onKeyDown={handleKeyDown}
            onDoubleClick={handleNodeDoubleClick}
        >
            {isDragOver && (
                <div
                    className={`absolute left-0 right-0 h-0.5 bg-bg-accent ${dragPosition === 'top' ? 'top-0' : 'bottom-0'}`}
                />
            )}

            <div ref={dragRef} draggable>
                <button
                    className={`
                        w-full px-3 h-9 rounded-md outline-none tabular-nums cursor-grab active:cursor-grabbing
                        ${
                            isSelected
                                ? 'bg-bg-accent/10 focus-visible:bg-bg-accent/15'
                                : 'bg-depth-2 hover:bg-depth-3 focus-visible:bg-depth-3'
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
