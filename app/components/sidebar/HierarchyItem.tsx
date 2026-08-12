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
    totalItems: number;
    selectItem: (id: string, ctrlKey: boolean, shiftKey: boolean) => void;
    isSelected: boolean;
    handleDragStart: (e: React.DragEvent, nodeId: string) => void;
    selectedItemIds: string[];
}

export const HierarchyItem = memo(function HierarchyItem({
    filteredItem,
    index,
    totalItems,
    selectItem,
    isSelected,
    handleDragStart,
    selectedItemIds,
}: HierarchyItemProps) {
    const router = useRouter();

    const currentNodeId = useItemsStore((state) => state.currentNodeId);
    const isNodeTabOpen = currentNodeId === filteredItem.id;

    const isPartOfSelectionGroup = isSelected && selectedItemIds.length > 1;

    const isNode = filteredItem.kind === 'node';
    const isEdge = filteredItem.kind === 'edge';

    const handleDoubleClick = (e: MouseEvent) => {
        e.stopPropagation();

        if (isNode) {
            openNodeTab(filteredItem.id, router);
        }
    };

    const isLast = index === totalItems - 1;

    const LINE_LEFT = 18.8;
    const LINE_WIDTH = 16;

    return (
        <li
            className="relative select-none cursor-grab"
            onClick={(e: MouseEvent) => selectItem(filteredItem.id, e.ctrlKey, e.shiftKey)}
            onDoubleClick={handleDoubleClick}
            onDragStart={(e) => handleDragStart(e, filteredItem.id)}
            draggable={true}
        >
            <div
                className="absolute border-l border-depth-3"
                style={{
                    left: `${LINE_LEFT}px`,
                    top: '0',
                    bottom: isLast ? '50%' : '0',
                    height: isLast ? '50%' : '100%',
                }}
            />

            <div
                className="absolute border-t border-depth-3"
                style={{
                    left: `${LINE_LEFT}px`,
                    top: '50%',
                    width: `${LINE_WIDTH}px`,
                }}
            />

            <div className="flex items-center gap-1 relative" style={{ paddingLeft: LINE_LEFT + LINE_WIDTH }}>
                <div
                    className={`
                    w-full px-3 h-9 rounded-md outline-none tabular-nums flex items-center text-nowrap
                    ${isSelected ? 'bg-bg-accent/10 border border-bg-accent/10' : 'bg-depth-2 hover:bg-depth-3 border border-depth-3'}
                    ${isPartOfSelectionGroup && 'border-bg-accent/20'}
                    relative z-10
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
                    </div>
                </div>
            </div>
        </li>
    );
});
