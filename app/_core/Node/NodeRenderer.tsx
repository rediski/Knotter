'use client';

import type { Node } from '@/_core/_/canvas.types';

import { getShape } from '@/utils/nodes/getShape';
import { NODE_SIZE } from '@/_core/_/canvas.constants';

import { useItemsStore } from '@/store/useItemsStore';

export function NodeRenderer({ node }: { node: Node }) {
    const { currentSceneId, scenes, selectedItemIds } = useItemsStore();

    const isSelected = selectedItemIds.includes(node.id);

    const scene = currentSceneId ? scenes[currentSceneId] : null;
    const items = scene?.items ?? [];

    const nodesAtSamePosition = items.filter(
        (item): item is Node =>
            item.kind === 'node' && item.position.x === node.position.x && item.position.y === node.position.y,
    );

    const hasDuplicatePosition = nodesAtSamePosition.length > 1;

    const Icon = getShape(node.shapeType).icon;
    const isPoint = node.shapeType === 'point';

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {(isSelected || hasDuplicatePosition) && (
                <div
                    className={`
                        absolute flex items-center justify-center z-[-1] border-2 border-dashed border-bg-accent rounded-xs p-5.5 
                        ${hasDuplicatePosition ? 'border-red' : ''}
                    `}
                />
            )}

            <Icon
                className={`
                    w-max fill-depth-1 hover:cursor-move active:cursor-grabbing 
                    ${isPoint ? 'stroke-[2px]' : 'stroke-[1.5px]'} 
                `}
                style={{ color: node.color }}
                size={NODE_SIZE}
            />
        </div>
    );
}
