'use client';

import { memo, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

import type { Node } from '@/_core/_/canvas.types';

import { EditableName } from '@/components/UI/EditableName';

import { openNodeTab } from '@/utils/nodes/openNodeTab';

import { Box } from 'lucide-react';
import { changeName } from '@/utils/items/changeName';

interface HierarchyItemProps {
    filteredNode: Node;
    index: number;
    selectItem: (id: string, ctrlKey: boolean, shiftKey: boolean) => void;
    isSelected: boolean;
    handleDragStart: (e: React.DragEvent, nodeId: string) => void;
    selectedItemIds: string[];
}

export const HierarchyItem = memo(function HierarchyItem({
    filteredNode,
    index,
    selectItem,
    isSelected,
    handleDragStart,
    selectedItemIds,
}: HierarchyItemProps) {
    const router = useRouter();

    const actualName = filteredNode.name;
    const orderNumber = index + 1;
    const isPartOfSelectionGroup = isSelected && selectedItemIds.length > 1;

    return (
        <li
            className="relative select-none cursor-grab"
            onClick={(e: MouseEvent) => selectItem(filteredNode.id, e.ctrlKey, e.shiftKey)}
            onDoubleClick={() => openNodeTab(filteredNode.id, router)}
            onDragStart={(e) => handleDragStart(e, filteredNode.id)}
            draggable={true}
        >
            <div
                className={`
                    w-full px-3 h-9 rounded-md outline-none tabular-nums flex items-center
                    ${isSelected ? 'bg-bg-accent/10 border border-bg-accent/10' : 'bg-depth-2 hover:bg-depth-3 border border-depth-3'}
                    ${isPartOfSelectionGroup && 'border-bg-accent/20'}
                `}
            >
                <div className="flex items-center gap-2 flex-1">
                    <Box size={16} className={`${isSelected ? 'text-text-accent' : 'text-foreground'}`} />

                    <div className={`border-l h-5 ${isSelected ? 'border-bg-accent/10' : 'border-depth-4'}`} />

                    <EditableName name={actualName} isSelected={isSelected} onChange={changeName} />

                    <span className={`ml-auto text-xs tabular-nums ${isSelected ? 'text-text-accent' : 'text-foreground'}`}>
                        #{orderNumber}
                    </span>
                </div>
            </div>
        </li>
    );
});
