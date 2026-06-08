'use client';

import { memo, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';

import type { Node } from '@/_core/_/canvas.types';

import { EditableName } from '@/components/UI/EditableName';

import { useItemsStore } from '@/store/useItemsStore';

import { openNodeTab } from '@/utils/nodes/openNodeTab';

import { Box } from 'lucide-react';
import { changeName } from '@/utils/items/changeName';

interface HierarchyItemProps {
    filteredNode: Node;
    index: number;
    selectItem: (id: string, ctrlKey: boolean, shiftKey: boolean) => void;
}

export const HierarchyItem = memo(function HierarchyItem({ filteredNode, index, selectItem }: HierarchyItemProps) {
    const router = useRouter();

    const selectedItemIds = useItemsStore((state) => state.selectedItemIds);
    const currentSceneId = useItemsStore((state) => state.currentSceneId);
    const scenes = useItemsStore((state) => state.scenes);

    const isSelected = selectedItemIds.includes(filteredNode.id);

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const currentItem = scene?.items.find((item) => item.id === filteredNode.id && item.kind === 'node');
    const actualName = (currentItem as Node & { name: string })?.name ?? filteredNode.name;

    const orderNumber = index + 1;

    return (
        <li
            className="relative select-none cursor-pointer"
            onClick={(e: MouseEvent) => selectItem(filteredNode.id, e.ctrlKey, e.shiftKey)}
            onDoubleClick={() => openNodeTab(filteredNode.id, router)}
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
                    <Box size={16} className={`${isSelected ? 'text-text-accent' : 'text-foreground'}`} />

                    <div className={`border-l h-5 ${isSelected ? 'border-bg-accent/10' : 'border-depth-4'}`} />

                    <EditableName name={actualName} isSelected={isSelected} onChange={changeName} />

                    <span suppressHydrationWarning className="ml-auto text-xs text-gray tabular-nums">
                        #{orderNumber}
                    </span>
                </div>
            </div>
        </li>
    );
});
