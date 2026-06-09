'use client';

import { Position, Node } from '@/_core/_/canvas.types';

interface NodeTooltipProps {
    node: Node;
    position: Position;
    zoomLevel: number;
    isSelected: boolean;
}

export function NodeTooltip({ node, position, zoomLevel, isSelected }: NodeTooltipProps) {
    return (
        <div
            className={`
                absolute flex flex-col gap-px px-3 py-1 border rounded-xl text-white text-xs whitespace-nowrap cursor-default select-none 
           
            `}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: `translateX(-50%) translateY(-100%) scale(${zoomLevel})`,
                transformOrigin: 'bottom center',
                backgroundColor: node.color,
                borderColor: node.color,
                color: node.color === '#ededed' ? 'black' : 'white',
            }}
        >
            <h2 className="text-base">{node.name}</h2>

            <div
                className={`
                    absolute top-full left-1/2 -translate-x-1/2 border-6 border-transparent
                    ${isSelected ? 'border-t-bg-accent' : 'border-t-foreground'}
                `}
                style={{ borderTopColor: node.color }}
            />
        </div>
    );
}
