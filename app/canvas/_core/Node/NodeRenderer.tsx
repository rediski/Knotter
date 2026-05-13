'use client';

import type { Node } from '@/canvas/_core/_/canvas.types';

import { getShape } from '@/canvas/utils/nodes/getShape';
import { NODE_SIZE } from '@/canvas/_core/_/canvas.constants';

import { useItemsStore } from '@/canvas/store/useItemsStore';

export function NodeRenderer({ node }: { node: Node }) {
    const isSelected = useItemsStore((state) => state.selectedItemIds.includes(node.id));
    const items = useItemsStore((state) => state.items);

    const nodesAtSamePosition = items.filter(
        (item): item is Node =>
            item.kind === 'node' && item.position.x === node.position.x && item.position.y === node.position.y,
    );

    const hasDuplicatePosition = nodesAtSamePosition.length > 1;

    const Icon = getShape(node.shapeType).icon;
    const isPoint = node.shapeType === 'point';

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <Icon
                className={`w-max fill-depth-1 hover:cursor-move active:cursor-grabbing 
                    ${isPoint ? 'stroke-[2px]' : 'stroke-[1.5px]'} 
                    ${hasDuplicatePosition ? 'text-red' : isSelected ? 'text-bg-accent' : ''}
                `}
                style={{ color: node.color }}
                width={NODE_SIZE}
                height={NODE_SIZE}
            />
        </div>
    );
}
