'use client';

import { memo, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

import type { CanvasItem } from '@/_core/_/canvas.types';

import { useItemsStore } from '@/store/useItemsStore';

import { openNodeTab } from '@/utils/nodes/openNodeTab';

import { LineSquiggle, Package, PackageOpen } from 'lucide-react';

interface HierarchyItemProps {
    filteredItem: CanvasItem;
    index: number;
    selectItem: (id: string, ctrlKey: boolean, shiftKey: boolean) => void;
    isSelected: boolean;
    handleDragStart: (e: React.DragEvent, nodeId: string) => void;
    selectedItemIds: string[];
}

export const HierarchyItem = memo(function HierarchyItem({
    filteredItem,
    index,
    selectItem,
    isSelected,
    handleDragStart,
    selectedItemIds,
}: HierarchyItemProps) {
    const router = useRouter();

    const currentNodeId = useItemsStore((state) => state.currentNodeId);
    const isNodeTabOpen = currentNodeId === filteredItem.id;

    const orderNumber = index + 1;
    const isPartOfSelectionGroup = isSelected && selectedItemIds.length > 1;

    const isNode = filteredItem.kind === 'node';
    const isEdge = filteredItem.kind === 'edge';

    const handleDoubleClick = (e: MouseEvent) => {
        e.stopPropagation();

        if (isNode) {
            openNodeTab(filteredItem.id, router);
        }
    };

    return (
        <li
            className="relative select-none cursor-grab"
            onClick={(e: MouseEvent) => selectItem(filteredItem.id, e.ctrlKey, e.shiftKey)}
            onDoubleClick={handleDoubleClick}
            onDragStart={(e) => handleDragStart(e, filteredItem.id)}
            draggable={true}
        >
            <div className="flex items-center gap-1">
                <div
                    className={`
                    w-full px-3 h-9 rounded-md outline-none tabular-nums flex items-center
                    ${isSelected ? 'bg-bg-accent/10 border border-bg-accent/10' : 'bg-depth-2 hover:bg-depth-3 border border-depth-3'}
                    ${isPartOfSelectionGroup && 'border-bg-accent/20'}
                `}
                >
                    <div className="flex items-center gap-2 flex-1">
                        {isNode &&
                            (isNodeTabOpen ? (
                                <PackageOpen
                                    size={16}
                                    className={`min-w-4 ${isSelected ? 'text-text-accent' : 'text-foreground'}`}
                                />
                            ) : (
                                <Package
                                    size={16}
                                    className={`min-w-4 ${isSelected ? 'text-text-accent' : 'text-foreground'}`}
                                />
                            ))}

                        {isEdge && (
                            <LineSquiggle
                                size={16}
                                className={`min-w-4 ${isSelected ? 'text-text-accent' : 'text-foreground'}`}
                            />
                        )}

                        <div className={`border-l h-5 ${isSelected ? 'border-bg-accent/10' : 'border-depth-4'}`} />

                        <span className={`text-sm ${isSelected ? 'text-text-accent' : 'text-foreground'}`}>
                            {filteredItem.name}
                        </span>

                        <span
                            className={`ml-auto text-xs tabular-nums ${isSelected ? 'text-text-accent' : 'text-foreground'}`}
                        >
                            #{orderNumber}
                        </span>
                    </div>
                </div>
            </div>
        </li>
    );
});
