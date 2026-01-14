import { Position, Node } from '@/canvas/canvas.types';

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
                absolute flex flex-col gap-0.25 px-2 py-1 bg-depth-1 border-2 rounded-md text-foreground text-xs whitespace-nowrap shadow-lg cursor-default select-none
                ${isSelected ? 'border-bg-accent' : 'border-foreground'}
            `}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: `translateX(-50%) translateY(-100%) scale(${zoomLevel})`,
                transformOrigin: 'bottom center',
            }}
        >
            <h2 className="text-base">{node.name}</h2>

            <div
                className={`
                    absolute top-full left-1/2 -translate-x-1/2 border-6 border-transparent
                    ${isSelected ? 'border-t-bg-accent' : 'border-t-foreground'}
                `}
            />
        </div>
    );
}
