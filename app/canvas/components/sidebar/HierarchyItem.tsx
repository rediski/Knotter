'use client';

import { memo, type MouseEvent } from 'react';

import type { Node } from '@/canvas/_core/_/canvas.types';

import { EditableName } from '@/components/UI/EditableName';

import { useItemsStore } from '@/canvas/store/useItemsStore';
import { useHierarchyItem } from '@/canvas/components/sidebar/useHierarchyItem';

import { Box } from 'lucide-react';

interface HierarchyItemProps {
    filteredNode: Node;
    index: number;
    selectItem: (id: string, ctrlKey: boolean, shiftKey: boolean) => void;
}

export const HierarchyItem = memo(function HierarchyItem({ filteredNode, index, selectItem }: HierarchyItemProps) {
    const { handleKeyDown, handleNameChange, handleNodeDoubleClick } = useHierarchyItem(filteredNode);

    const selectedItemIds = useItemsStore((state) => state.selectedItemIds);
    const isSelected = selectedItemIds.includes(filteredNode.id);

    const orderNumber = index + 1;

    return (
        <li
            className="relative select-none cursor-pointer"
            onClick={(e: MouseEvent) => selectItem(filteredNode.id, e.ctrlKey, e.shiftKey)}
            onKeyDown={handleKeyDown}
            onDoubleClick={handleNodeDoubleClick}
        >
            <div
                className={`
                    w-full px-3 h-9 rounded-md outline-none tabular-nums flex items-center
                    ${
                        isSelected
                            ? 'bg-bg-accent/10 border border-bg-accent/10 focus-visible:bg-bg-accent/15'
                            : 'bg-depth-2 hover:bg-depth-3 border border-depth-3 focus-visible:bg-depth-3'
                    }
                `}
            >
                <div className="flex items-center gap-2 flex-1">
                    <Box size={16} />

                    <div className={`border-l h-5 ${isSelected ? 'border-bg-accent/10' : 'border-depth-4'}`} />

                    <EditableName name={filteredNode.name} isSelected={isSelected} onChange={handleNameChange} />

                    <span className="ml-auto text-xs text-gray tabular-nums">#{orderNumber}</span>
                </div>
            </div>
        </li>
    );
});
