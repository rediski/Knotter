import { Position } from '@/canvas/canvas.types';

interface NodeTooltipProps {
    label?: string;
    position: Position;
    zoomLevel: number;
}

export function NodeTooltip({ label, position, zoomLevel }: NodeTooltipProps) {
    return (
        <div
            className="absolute px-2 py-1 bg-bg-accent text-white text-xs rounded whitespace-nowrap shadow-lg border border-bg-accent"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: `translateX(-50%) translateY(-100%) scale(${zoomLevel})`,
                transformOrigin: 'bottom center',
            }}
        >
            {label}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-bg-accent" />
        </div>
    );
}
