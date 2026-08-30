'use client';

import type { Node } from '@/_core/_/canvas.types';

import { getShape } from '@/utils/nodes/getShape';
import { NODE_SIZE } from '@/_core/_/canvas.constants';

import { useItemsStore } from '@/store/useItemsStore';

export function NodeRenderer({ node, isNodePage }: { node: Node; isNodePage: boolean }) {
    const { currentSceneId, scenes, selectedItemIds, hoveredNodeId, tempEdge } = useItemsStore();

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

    const isHovered = hoveredNodeId === node.id;
    const isHoveredWithTempEdge = isHovered && tempEdge != null && hoveredNodeId !== tempEdge;

    const borderClass = (() => {
        if (hasDuplicatePosition) return 'border-red';
        if (isHoveredWithTempEdge) return 'border-green';
        return 'border-bg-accent';
    })();

    return (
        <div
            className="relative w-full h-full flex items-center justify-center"
            onMouseEnter={() => useItemsStore.getState().setHoveredNodeId(node.id)}
            onMouseLeave={() => useItemsStore.getState().setHoveredNodeId(null)}
        >
            {(isSelected || hasDuplicatePosition || isHoveredWithTempEdge) && (
                <div
                    className={`
                        absolute flex items-center justify-center z-[-1] border-2 border-dashed rounded-xs p-5.5
                        ${borderClass}
                    `}
                />
            )}

            <Icon
                className={`
                    w-max fill-depth-1
                    ${isNodePage ? 'hover:cursor-pointer' : 'hover:cursor-move active:cursor-grabbing'}
                    ${isPoint ? 'stroke-[2px]' : 'stroke-[1.5px]'}
                `}
                style={{ color: node.color ?? 'var(--foreground)' }}
                size={NODE_SIZE}
            />
        </div>
    );
}
